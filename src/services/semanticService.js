import { Cache } from "../utils/cache";
import { CONFIG } from "../config/config";

const cache = new Cache(CONFIG.CACHE_TTL);

// Key concepts extraction
function extractKeyConcepts(text) {
  const concepts = new Set();
  const lowercaseText = text.toLowerCase();

  // Define key concept patterns
  const conceptPatterns = {
    photosynthesis: ["photosynthesis", "photo-synthesis"],
    sunlight: ["sunlight", "sun light", "light energy", "solar"],
    carbonDioxide: ["carbon dioxide", "co2", "carbon-dioxide"],
    water: ["water", "h2o"],
    glucose: ["glucose", "sugar"],
    oxygen: ["oxygen", "o2"],
    plants: ["plants", "plant"],
    process: ["process", "convert", "turn", "transform", "change"],
  };

  // Check for each concept
  Object.entries(conceptPatterns).forEach(([concept, patterns]) => {
    if (patterns.some((pattern) => lowercaseText.includes(pattern))) {
      concepts.add(concept);
    }
  });

  return concepts;
}

// Calculate concept similarity
function calculateConceptSimilarity(text1, text2) {
  const concepts1 = extractKeyConcepts(text1);
  const concepts2 = extractKeyConcepts(text2);

  const intersection = new Set([...concepts1].filter((x) => concepts2.has(x)));
  const union = new Set([...concepts1, ...concepts2]);

  return intersection.size / union.size;
}

// Calculate word order similarity
function calculateWordOrderSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);

  let matchCount = 0;
  let totalWords = Math.max(words1.length, words2.length);

  words1.forEach((word, index) => {
    const similarWords = words2.filter((w2) => {
      return (
        w2 === word ||
        w2.includes(word) ||
        word.includes(w2) ||
        levenshteinDistance(word, w2) <= 2
      );
    });

    if (similarWords.length > 0) {
      const wordIndex = words2.indexOf(similarWords[0]);
      const positionDiff = Math.abs(index - wordIndex);
      const positionScore = 1 - positionDiff / totalWords;
      matchCount += positionScore;
    }
  });

  return matchCount / totalWords;
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) track[0][i] = i;
  for (let j = 0; j <= str2.length; j++) track[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
}

export async function evaluateAnswer(studentText, correctText) {
  if (!studentText || !correctText) {
    return 0;
  }

  try {
    // Calculate different similarity metrics
    const conceptSimilarity = calculateConceptSimilarity(
      studentText,
      correctText
    );
    const orderSimilarity = calculateWordOrderSimilarity(
      studentText,
      correctText
    );

    // Weighted scoring
    const weights = {
      concepts: 0.7, // Key concepts are most important
      order: 0.3, // Word order and structure less important
    };

    const finalScore =
      (conceptSimilarity * weights.concepts + orderSimilarity * weights.order) *
      10;

    // Apply bonus for complete answers
    const conceptCount = extractKeyConcepts(correctText).size;
    const studentConceptCount = extractKeyConcepts(studentText).size;
    const conceptCoverage = studentConceptCount / conceptCount;

    // Bonus points for high concept coverage
    let bonusPoints = 0;
    if (conceptCoverage >= 0.8) {
      bonusPoints = 1;
    } else if (conceptCoverage >= 0.6) {
      bonusPoints = 0.5;
    }

    // Final score with bonus
    const scoreWithBonus = Math.min(finalScore + bonusPoints, 10);

    return Math.round(scoreWithBonus * 100) / 100;
  } catch (error) {
    console.error("Error in evaluateAnswer:", error);
    return calculateConceptSimilarity(studentText, correctText) * 10;
  }
}
