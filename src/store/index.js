import { defineStore } from "pinia";
import { Cache } from "../utils/cache";
import { CONFIG } from "../config/config";

const questionCache = new Cache(CONFIG.CACHE_TTL);

export const useQuestionStore = defineStore("questions", {
  state: () => ({
    questions: [],
    currentQuestion: null,
    previewQuestion: null,
    error: null,
    isLoading: false,
    mode: "demo"
  }),

  getters: {
    hasQuestions: (state) => state.questions.length > 0,
    
    questionById: (state) => (id) => {
      return state.questions.find(q => q.id === id) || null;
    },
    
    sortedQuestions: (state) => {
      return [...state.questions].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
  },

  actions: {
    async setPreviewQuestion(question) {
      try {
        if (!question?.question || !question?.correctAnswer) {
          throw new Error("Invalid question format");
        }
        this.previewQuestion = {
          ...question,
          id: question.id || Date.now(),
          // Ensure sampleAnswers is always an array
          sampleAnswers: question.sampleAnswers || []
        };
      } catch (error) {
        this.error = error.message;
        console.error("Failed to set preview question:", error);
      }
    },

    async setCurrentQuestion(question) {
      try {
        if (!question?.id) {
          throw new Error("Invalid question ID");
        }
        
        // Try to get from cache first
        const cachedQuestion = questionCache.get(question.id);
        if (cachedQuestion) {
          this.currentQuestion = cachedQuestion;
          return;
        }
        
        // Ensure sampleAnswers is always an array
        this.currentQuestion = {
          ...question,
          sampleAnswers: question.sampleAnswers || []
        };
        questionCache.set(question.id, this.currentQuestion);
      } catch (error) {
        this.error = error.message;
        console.error("Failed to set current question:", error);
      }
    },

    async addQuestion(question) {
      try {
        this.isLoading = true;
        this.error = null;

        if (!question?.question || !question?.correctAnswer) {
          throw new Error("Missing required question fields");
        }

        const newQuestion = {
          ...question,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          // Ensure sampleAnswers is always an array
          sampleAnswers: question.sampleAnswers || []
        };

        this.questions.push(newQuestion);
        await this.setCurrentQuestion(newQuestion);
      } catch (error) {
        this.error = error.message;
        console.error("Failed to add question:", error);
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    resetState() {
      this.questions = [];
      this.currentQuestion = null;
      this.previewQuestion = null;
      this.error = null;
      this.isLoading = false;
      questionCache.clear();
    }
  },
});