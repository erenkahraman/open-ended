import { ref, computed } from 'vue';
import { useQuestionStore } from '../store';
import { useUserStore } from '../store/modules/user';
import { useRouter } from 'vue-router';

export function useQuestionForm() {
  const router = useRouter();
  const questionStore = useQuestionStore();
  const userStore = useUserStore();

  const form = ref({
    question: "",
    correctAnswer: "",
    sampleAnswers: [
      { level: "Excellent", score: 9.5, answer: "" },
      { level: "Good", score: 7.5, answer: "" },
      { level: "Fair", score: 5.5, answer: "" }
    ]
  });

  const isLoading = ref(false);
  const selectedId = ref(null);
  const shouldValidate = ref(false);

  const previewData = computed(() => ({
    id: Date.now(),
    question: form.value.question,
    correctAnswer: form.value.correctAnswer,
    sampleAnswers: form.value.sampleAnswers
  }));

  const loadSample = (sampleQuestion) => {
    if (!sampleQuestion) return;
    form.value = {
      question: sampleQuestion.question,
      correctAnswer: sampleQuestion.correctAnswer,
      sampleAnswers: sampleQuestion.sampleAnswers
    };
    selectedId.value = sampleQuestion.id;
    questionStore.setPreviewQuestion(form.value);
  };

  const handleFormUpdate = (newValue) => {
    form.value = { ...form.value, ...newValue };
    shouldValidate.value = true;
    questionStore.setPreviewQuestion(form.value);
  };

  const reset = () => {
    form.value = {
      question: "",
      correctAnswer: "",
      sampleAnswers: [
        { level: "Excellent", score: 9.5, answer: "" },
        { level: "Good", score: 7.5, answer: "" },
        { level: "Fair", score: 5.5, answer: "" }
      ]
    };
    selectedId.value = null;
    shouldValidate.value = false;
    questionStore.setPreviewQuestion(null);
  };

  const assign = async () => {
    try {
      isLoading.value = true;
      const question = await questionStore.addQuestion({
        ...form.value,
        createdBy: userStore.currentUser,
        createdAt: new Date().toISOString()
      });
      if (question) {
        localStorage.setItem('currentQuestion', JSON.stringify(question));
        router.push("/student");
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    form,
    isLoading,
    selectedId,
    shouldValidate,
    previewData,
    handleFormUpdate,
    loadSample,
    reset,
    assign
  };
} 