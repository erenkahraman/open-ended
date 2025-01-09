export class SynonymManager {
  constructor() {
    this.synonymsMap = new Map();
    this.commonSynonyms = this.initializeCommonSynonyms();
  }

  initializeCommonSynonyms() {
    return {
      good: ["great", "excellent", "fine", "satisfactory"],
      bad: ["poor", "terrible", "awful", "unsatisfactory"],
      big: ["large", "huge", "massive", "enormous"],
      small: ["tiny", "little", "miniature", "compact"],
      // Add more common synonyms as needed
    };
  }

  async getSynonymsWithWordNet(word) {
    // Return common synonyms if available, otherwise empty array
    return this.commonSynonyms[word.toLowerCase()] || [];
  }

  addSynonymsToLowercase(synonymsArray, synonymsSet) {
    synonymsArray?.forEach((syn) => synonymsSet.add(syn.toLowerCase()));
  }

  async updateSynonyms(word, synonyms) {
    const commonSyns = await this.getSynonymsWithWordNet(word);
    const allSynonyms = new Set([...synonyms, ...commonSyns]);
    this.synonymsMap.set(word.toLowerCase(), Array.from(allSynonyms));
  }

  getSynonyms(word) {
    const commonSyns = this.commonSynonyms[word.toLowerCase()] || [];
    const customSyns = this.synonymsMap.get(word.toLowerCase()) || [];
    return Array.from(new Set([...commonSyns, ...customSyns]));
  }
}