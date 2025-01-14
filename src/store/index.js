import { defineStore } from "pinia";
import { validateText } from "../utils/textCleaner";

export const useQuestionStore = defineStore("questions", {
  state: () => ({
    currentQuestion: null,
    previewQuestion: null,
    isLoading: false
  }),

  actions: {
    setPreviewQuestion(question) {
      this.previewQuestion = question ? {
        ...question,
        id: question.id || Date.now(),
        sampleAnswers: question.sampleAnswers || []
      } : null;
    },

    setCurrentQuestion(question) {
      if (!question?.id) return;
      this.currentQuestion = {
        ...question,
        sampleAnswers: question.sampleAnswers || []
      };
    },

    addQuestion(question) {
      if (!question?.question || !question?.correctAnswer) return;
      if (!validateText(question.question) || !validateText(question.correctAnswer)) return;
      
      const newQuestion = {
        ...question,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      this.currentQuestion = newQuestion;
      return newQuestion;
    },

    resetState() {
      this.currentQuestion = null;
      this.previewQuestion = null;
      this.isLoading = false;
    }
  }
});