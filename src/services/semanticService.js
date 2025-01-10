import { pipeline } from '@xenova/transformers';
import { Cache } from '../utils/cache';
import { CONFIG } from '../config/config';

const DEBUG = true;
const log = (...args) => DEBUG && console.log('[SemanticService]', ...args);

const MODEL_CONFIG = {
  primary: 'Xenova/all-MiniLM-L6-v2',
  fallback: 'Xenova/all-mpnet-base-v2',
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000
};

class SemanticService {
  constructor() {
    this.cache = new Cache(CONFIG.CACHE_TTL);
    this.model = null;
    this.modelPromise = null;
    this.isInitializing = false;
    this.retryCount = 0;
    this.currentModelName = MODEL_CONFIG.primary;
    this.initModel();
  }

  async initModel() {
    try {
      await this.ensureModel();
    } catch (error) {
      log('Model initialization failed:', error);
      if (this.retryCount < MODEL_CONFIG.maxRetries) {
        this.retryCount++;
        log(`Retrying initialization (${this.retryCount}/${MODEL_CONFIG.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, MODEL_CONFIG.retryDelay));
        await this.initModel();
      } else if (this.currentModelName === MODEL_CONFIG.primary) {
        log('Switching to fallback model...');
        this.currentModelName = MODEL_CONFIG.fallback;
        this.retryCount = 0;
        await this.initModel();
      }
    }
  }

  async ensureModel() {
    if (this.model) return this.model;
    if (this.modelPromise) return this.modelPromise;
    if (this.isInitializing) {
      const startTime = Date.now();
      while (this.isInitializing) {
        if (Date.now() - startTime > MODEL_CONFIG.timeout) {
          throw new Error('Model initialization timeout');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.model;
    }

    try {
      this.isInitializing = true;
      log(`Loading model: ${this.currentModelName}`);

      this.modelPromise = pipeline('feature-extraction', this.currentModelName, {
        quantized: true,
        progress_callback: progress => {
          if (typeof progress === 'number') {
            const pct = Math.round(progress * 100);
            log(`Loading progress: ${pct}%`);
          }
        }
      });

      this.model = await Promise.race([
        this.modelPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Model loading timeout')), MODEL_CONFIG.timeout)
        )
      ]);

      log('Model loaded successfully');
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
    if (!text?.trim()) return null;

    const cacheKey = `emb_${text}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const model = await this.ensureModel();
      if (!model) return null;

      const output = await model(text, { pooling: 'mean', normalize: true });
      if (!output?.data) return null;

      const embedding = Array.from(output.data);
      this.cache.set(cacheKey, embedding);
      return embedding;
    } catch (error) {
      log('Error getting embedding:', error);
      return null;
    }
  }

  cosineSimilarity(vecA, vecB) {
    if (!vecA?.length || !vecB?.length || vecA.length !== vecB.length) return 0;

    try {
      const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
      const magA = Math.sqrt(vecA.reduce((sum, x) => sum + x * x, 0));
      const magB = Math.sqrt(vecB.reduce((sum, x) => sum + x * x, 0));
      
      return (!magA || !magB) ? 0 : dotProduct / (magA * magB);
    } catch {
      return 0;
    }
  }

  async evaluateAnswer(studentAnswer, correctAnswer, question) {
    if (!studentAnswer?.trim() || !correctAnswer?.trim()) return 0;

    const cacheKey = `score_${studentAnswer}_${correctAnswer}_${question || ''}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const [studentEmbed, correctEmbed, questionEmbed] = await Promise.all([
        this.getEmbedding(studentAnswer),
        this.getEmbedding(correctAnswer),
        question ? this.getEmbedding(question) : null
      ]);

      if (!studentEmbed || !correctEmbed) return 0;

      let score = this.cosineSimilarity(studentEmbed, correctEmbed);
      
      if (questionEmbed) {
        const questionRelevance = this.cosineSimilarity(studentEmbed, questionEmbed);
        score = score * CONFIG.SIMILARITY_WEIGHT + questionRelevance * CONFIG.RELEVANCE_WEIGHT;
      }

      const finalScore = Math.min(Math.max(score * 10, CONFIG.MIN_SCORE), CONFIG.MAX_SCORE);
      this.cache.set(cacheKey, finalScore);
      return finalScore;
    } catch (error) {
      log('Error evaluating answer:', error);
      return 0;
    }
  }
}

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
