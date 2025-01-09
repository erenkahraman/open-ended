import { pipeline } from '@xenova/transformers';
import { Cache } from '../utils/cache';
import { CONFIG } from '../config/config';

const DEBUG = true;
const log = (...args) => DEBUG && console.log('[SemanticService]', ...args);

class SemanticService {
  constructor() {
    this.cache = new Cache(CONFIG.CACHE_TTL);
    this.model = null;
    this.modelPromise = null;
    this.isInitializing = false;
    log('Initializing service');
    this.initModel();
  }

  async initModel() {
    try {
      log('Starting model initialization');
      await this.ensureModel();
    } catch (error) {
      log('Model initialization failed:', error);
    }
  }

  async ensureModel() {
    if (this.model) {
      return this.model;
    }

    if (this.modelPromise) {
      return this.modelPromise;
    }

    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.model;
    }

    try {
      this.isInitializing = true;
      log('Loading model...');

      // Attempt to load the primary model from a local directory
      try {
        this.modelPromise = pipeline(
          'feature-extraction', 
          '/models/all-MiniLM-L6-v2/', // Local path to the model directory
          {
            progress_callback: (progress) => {
              const pct = (typeof progress === 'number') ? Math.round(progress * 100) : 0;
              log(`Loading progress: ${pct}%`);
            }
          }
        );
        this.model = await this.modelPromise;
        log('Primary model loaded successfully');
      } catch (primaryError) {
        log('Primary model load failed, attempting fallback:', primaryError);
        // Attempt loading fallback model from another local directory
        this.modelPromise = pipeline(
          'feature-extraction', 
          '/models/all-mpnet-base-v2/', // Local path to fallback model directory
          {
            progress_callback: (progress) => {
              const pct = (typeof progress === 'number') ? Math.round(progress * 100) : 0;
              log(`Fallback loading progress: ${pct}%`);
            }
          }
        );
        this.model = await this.modelPromise;
        log('Fallback model loaded successfully');
      }

      return this.model;
    } catch (error) {
      log('Error loading model:', error);
      this.model = null;
      throw error;
    } finally {
      this.isInitializing = false;
      this.modelPromise = null;
    }
  }

  async getEmbedding(text) {
    if (!text || typeof text !== 'string') {
      log('Invalid text input');
      return null;
    }

    const cacheKey = `emb_${text}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const model = await this.ensureModel();
      if (!model) {
        log('Model not available');
        return null;
      }

      const output = await model(text, { pooling: 'mean', normalize: true });
      if (!output || !output.data) {
        log('Invalid model output');
        return null;
      }

      const embedding = Array.from(output.data);
      this.cache.set(cacheKey, embedding);
      return embedding;
    } catch (error) {
      log('Error getting embedding:', error);
      return null;
    }
  }

  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      return 0;
    }

    try {
      const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const magA = Math.sqrt(vecA.reduce((sum, x) => sum + x * x, 0));
      const magB = Math.sqrt(vecB.reduce((sum, x) => sum + x * x, 0));
      
      if (!magA || !magB) return 0;
      return dotProduct / (magA * magB);
    } catch (error) {
      log('Error calculating similarity:', error);
      return 0;
    }
  }

  async evaluateAnswer(studentAnswer, correctAnswer, question) {
    if (!studentAnswer || !correctAnswer) {
      log('Missing required answers');
      return 0;
    }

    const cacheKey = `score_${studentAnswer}_${correctAnswer}_${question || ''}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    try {
      // Get embeddings
      const [studentEmbed, correctEmbed, questionEmbed] = await Promise.all([
        this.getEmbedding(studentAnswer),
        this.getEmbedding(correctAnswer),
        question ? this.getEmbedding(question) : Promise.resolve(null)
      ]);

      if (!studentEmbed || !correctEmbed) {
        log('Failed to generate embeddings');
        return 0;
      }

      // Calculate base similarity
      let score = this.cosineSimilarity(studentEmbed, correctEmbed);

      // Consider question context if available
      if (questionEmbed) {
        const questionRelevance = this.cosineSimilarity(studentEmbed, questionEmbed);
        score = score * 0.7 + questionRelevance * 0.3;
      }

      // Scale to percentage and ensure valid range
      const finalScore = Math.min(Math.max(score * 100, 0), 100);
      this.cache.set(cacheKey, finalScore);
      return finalScore;
    } catch (error) {
      log('Error evaluating answer:', error);
      return 0;
    }
  }
}

// Export singleton instance
const service = new SemanticService();

export const evaluateAnswer = async (studentAnswer, correctAnswer, question) => {
  try {
    const score = await service.evaluateAnswer(studentAnswer, correctAnswer, question);
    log('Evaluation complete, score:', score);
    return score;
  } catch (error) {
    log('Error in evaluateAnswer:', error);
    return 0;
  }
};
