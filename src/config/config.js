export const CONFIG = {
  // Cache settings
  CACHE_TTL: 60 * 60 * 1000, // 1 hour in milliseconds

  // Model settings
  MODEL_NAME: 'Xenova/all-MiniLM-L6-v2',
  
  // Evaluation settings
  SIMILARITY_WEIGHT: 0.7,
  RELEVANCE_WEIGHT: 0.3,
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  
  // Score thresholds
  THRESHOLDS: {
    EXCELLENT: 90,
    GOOD: 75,
    FAIR: 60,
    POOR: 40
  },

  // Text validation
  MIN_TEXT_LENGTH: 10,
  MIN_WORDS: 5
};