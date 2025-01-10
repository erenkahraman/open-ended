import { computed } from 'vue';
import { validateText } from '../utils/textCleaner';
import { CONFIG } from '../config/config';

export function useFormValidation(form) {
  const errors = computed(() => ({
    question: !validateText(form.value.question, CONFIG.MIN_QUESTION_LENGTH, CONFIG.MIN_QUESTION_WORDS) 
      ? `Question must be at least ${CONFIG.MIN_QUESTION_LENGTH} characters and ${CONFIG.MIN_QUESTION_WORDS} words` 
      : null,
    correctAnswer: !validateText(form.value.correctAnswer, CONFIG.MIN_ANSWER_LENGTH, CONFIG.MIN_ANSWER_WORDS)
      ? `Answer must be at least ${CONFIG.MIN_ANSWER_LENGTH} characters and ${CONFIG.MIN_ANSWER_WORDS} words`
      : null
  }));

  const hasErrors = computed(() => Object.values(errors.value).some(Boolean));
  const canSubmit = computed(() => !hasErrors.value);

  return {
    errors,
    hasErrors,
    canSubmit
  };
} 