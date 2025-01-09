import { defineStore } from "pinia";

export const useQuestionStore = defineStore("questions", {
  state: () => ({
    questions: [],
    currentQuestion: null,
    demoQuestions: [
      {
        id: 1,
        question:
          "What is the process by which plants convert carbon dioxide and water into glucose and oxygen using sunlight?",
        correctAnswer:
          "Photosynthesis is the process by which plants use sunlight to convert carbon dioxide and water into glucose and oxygen...",
        sampleAnswers: [],
      },
    ],
    mode: "demo",
    previewQuestion: null,
  }),

  actions: {
    setPreviewQuestion(question) {
      this.previewQuestion = question;
    },
    setCurrentQuestion(question) {
      this.currentQuestion = question;
    },
    addQuestion(question) {
      const newQuestion = {
        ...question,
        id: Date.now(),
      };
      this.questions.push(newQuestion);
      this.setCurrentQuestion(newQuestion);
    },
  },
});