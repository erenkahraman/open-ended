export const EVALUATION_CONFIG = {
  // Minimum requirements
  MIN_SENTENCE_LENGTH: 10,
  MIN_WORD_COUNT: 5,
  
  // Caching
  CACHE_TTL: 3600, // 1 hour
  
  // Similarity thresholds
  THRESHOLDS: {
    EXCELLENT: 0.8,
    GOOD: 0.6,
    FAIR: 0.4,
    POOR: 0.2
  },
  
  // Confidence levels
  CONFIDENCE: {
    HIGH: 0.8,
    MEDIUM: 0.6,
    LOW: 0.4
  },
  
  // Analysis weights
  WEIGHTS: {
    // Base weights for different analysis types
    BASE: {
      semantic: 0.25,
      structural: 0.2,
      conceptual: 0.2,
      contextual: 0.15,
      technical: 0.15,
      domain: 0.05
    },
    
    // Weight adjustments based on confidence
    CONFIDENCE_ADJUSTMENTS: {
      HIGH: {
        semantic: -0.05,
        conceptual: 0.025,
        contextual: 0.025,
        technical: 0.025,
        domain: 0.025
      },
      LOW: {
        semantic: 0.05,
        structural: 0.025,
        conceptual: -0.05,
        contextual: -0.025,
        technical: -0.025
      }
    }
  },
  
  // Pattern recognition settings
  PATTERNS: {
    DEFINITION: {
      MIN_STRENGTH: 0.4,
      EXCELLENT_STRENGTH: 0.8,
      WEIGHT: 0.3
    },
    EXPLANATION: {
      MIN_STRENGTH: 0.4,
      EXCELLENT_STRENGTH: 0.8,
      WEIGHT: 0.4
    },
    TECHNICAL: {
      MIN_DENSITY: 0.1,
      EXCELLENT_DENSITY: 0.2,
      WEIGHT: 0.3
    }
  },
  
  // Context analysis settings
  CONTEXT: {
    DOMAIN_ALIGNMENT: {
      MIN_SCORE: 0.4,
      EXCELLENT_SCORE: 0.8,
      WEIGHT: 0.3
    },
    CONCEPTUAL_DEPTH: {
      MIN_SCORE: 0.4,
      EXCELLENT_SCORE: 0.8,
      WEIGHT: 0.4
    },
    TECHNICAL_ACCURACY: {
      MIN_SCORE: 0.4,
      EXCELLENT_SCORE: 0.8,
      WEIGHT: 0.3
    }
  },
  
  // Domain-specific settings
  DOMAIN: {
    'machine-learning': {
      CONCEPT_WEIGHT: 0.4,
      RELATIONSHIP_WEIGHT: 0.3,
      TECHNICAL_WEIGHT: 0.3,
      MIN_CONCEPTS: 3,
      MIN_RELATIONSHIPS: 2,
      MIN_TECHNICAL_TERMS: 3
    },
    'programming': {
      CONCEPT_WEIGHT: 0.35,
      RELATIONSHIP_WEIGHT: 0.35,
      TECHNICAL_WEIGHT: 0.3,
      MIN_CONCEPTS: 3,
      MIN_RELATIONSHIPS: 2,
      MIN_TECHNICAL_TERMS: 3
    }
  },
  
  // Adaptive learning settings
  ADAPTIVE: {
    HISTORY_WEIGHT: 0.2,
    MIN_HISTORY_SAMPLES: 5,
    MAX_HISTORY_SAMPLES: 100,
    LEARNING_RATE: 0.1,
    MIN_CONFIDENCE: 0.3,
    WEIGHT_CHANGE_THRESHOLD: 0.01
  }
}; 