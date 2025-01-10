import { defineStore } from "pinia";
import { Cache } from "../utils/cache";
import { CONFIG } from "../config/config";
import { validateText } from "../utils/textCleaner";

const questionCache = new Cache(CONFIG.CACHE_TTL);

export const useQuestionStore = defineStore("questions", {
  state: () => ({
    questions: [],
    currentQuestion: null,
    previewQuestion: null,
    isLoading: false
  }),

  getters: {
    hasQuestions: state => state.questions.length > 0,
    questionById: state => id => state.questions.find(q => q.id === id) || null,
    sortedQuestions: state => [...state.questions].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    ),
    validQuestions: state => state.questions.filter(q => 
      validateText(q.question, CONFIG.MIN_TEXT_LENGTH, CONFIG.MIN_WORDS) &&
      validateText(q.correctAnswer, CONFIG.MIN_TEXT_LENGTH, CONFIG.MIN_WORDS)
    )
  },

  actions: {
    async setPreviewQuestion(question) {
      if (!question?.question || !question?.correctAnswer) return;
      if (!validateText(question.question) || !validateText(question.correctAnswer)) return;

      this.previewQuestion = {
        ...question,
        id: question.id || Date.now(),
        sampleAnswers: question.sampleAnswers || []
      };
    },

    async setCurrentQuestion(question) {
      if (!question?.id) return;
      
      const cachedQuestion = questionCache.get(question.id);
      if (cachedQuestion) {
        this.currentQuestion = cachedQuestion;
        return;
      }
      
      this.currentQuestion = {
        ...question,
        sampleAnswers: question.sampleAnswers || []
      };
      questionCache.set(question.id, this.currentQuestion);
    },

    async addQuestion(question) {
      try {
        this.isLoading = true;

        if (!question?.question || !question?.correctAnswer) return;
        if (!validateText(question.question) || !validateText(question.correctAnswer)) return;

        const newQuestion = {
          ...question,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          sampleAnswers: question.sampleAnswers || []
        };

        this.questions.push(newQuestion);
        await this.setCurrentQuestion(newQuestion);
      } finally {
        this.isLoading = false;
      }
    },

    resetState() {
      this.questions = [];
      this.currentQuestion = null;
      this.previewQuestion = null;
      this.isLoading = false;
      questionCache.clear();
    }
  }
});