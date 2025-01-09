export const CONFIG = {
  // Cache settings
  CACHE_TTL: 60 * 60 * 1000, // 1 hour in milliseconds

  // Model settings
  MODEL_NAME: 'Xenova/all-MiniLM-L6-v2',
  FALLBACK_MODEL: 'Xenova/all-mpnet-base-v2',
  
  // Evaluation settings
  SIMILARITY_WEIGHT: 0.7,
  RELEVANCE_WEIGHT: 0.3,
  MIN_SCORE: 0,
  MAX_SCORE: 100,
  
  // Thresholds
  EXCELLENT_THRESHOLD: 90,
  GOOD_THRESHOLD: 75,
  FAIR_THRESHOLD: 60,
  POOR_THRESHOLD: 40,
};