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
      { level: "Fair", score: 5.5, answer: "" },
    ]
  });

  const isLoading = ref(false);
  const selectedId = ref(null);
  const shouldValidate = ref(false);

  const previewData = computed(() => ({
    id: Date.now(),
    question: form.value.question,
    correctAnswer: form.value.correctAnswer,
    sampleAnswers: form.value.sampleAnswers.map(a => ({ ...a }))
  }));

  const handleFormUpdate = (newValue) => {
    form.value = { ...newValue };
    shouldValidate.value = true;
  };

  const loadSample = ({ id, question, correctAnswer, sampleAnswers }) => {
    shouldValidate.value = false;
    selectedId.value = id;
    form.value = { question, correctAnswer, sampleAnswers: sampleAnswers.map(a => ({ ...a })) };
  };

  const reset = () => {
    shouldValidate.value = false;
    selectedId.value = null;
    form.value = {
      question: "",
      correctAnswer: "",
      sampleAnswers: form.value.sampleAnswers.map(a => ({ ...a, answer: "" }))
    };
  };

  const assign = async () => {
    try {
      isLoading.value = true;
      await questionStore.addQuestion({
        ...form.value,
        createdBy: userStore.currentUser,
        createdAt: new Date().toISOString()
      });
      router.push("/student");
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