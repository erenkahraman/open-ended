import { ref, computed, watch } from 'vue';
import { validateText } from '../utils/textCleaner';
import { CONFIG } from '../config/config';

export function useAnswerSubmission(props, emit) {
  const answer = ref("");
  const score = ref(null);
  const isLoading = ref(false);
  const submittedAt = ref("");

  const isSubmitted = computed(() => score.value !== null);
  const canSubmit = computed(() => validateText(answer.value, CONFIG.MIN_ANSWER_LENGTH, CONFIG.MIN_ANSWER_WORDS));
  const placeholder = computed(() => props.previewMode 
    ? props.question.correctAnswer || "No correct answer provided"
    : "Enter your answer here..."
  );

  const submit = async () => {
    if (!canSubmit.value || isLoading.value) return;
    
    try {
      isLoading.value = true;
      const result = await emit('submit', {
        answer: answer.value.trim(),
        question: props.question,
        user: props.user
      });
      
      if (result) {
        score.value = result.score;
        submittedAt.value = new Date().toISOString();
      }
    } finally {
      isLoading.value = false;
    }
  };

  watch(() => props.previewMode, (newValue) => {
    if (newValue && props.question.correctAnswer) {
      answer.value = props.question.correctAnswer;
    } else if (!newValue) {
      answer.value = "";
    }
  }, { immediate: true });

  return {
    answer,
    score,
    isLoading,
    submittedAt,
    isSubmitted,
    canSubmit,
    placeholder,
    submit
  };
} 