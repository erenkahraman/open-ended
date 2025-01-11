import { ref, computed, watch } from 'vue';
import { CONFIG } from '../config/config';

const validateText = (text, minLength = CONFIG.MIN_ANSWER_LENGTH, minWords = CONFIG.MIN_ANSWER_WORDS) => {
  if (!text) return false;
  const trimmedText = text.trim();
  const wordCount = trimmedText.split(/\s+/).length;
  return trimmedText.length >= minLength && wordCount >= minWords;
};

export function useAnswerSubmission(props, emit) {
  const answer = ref("");
  const score = ref(null);
  const isLoading = ref(false);
  const submittedAt = ref("");
  const error = ref(null);

  const isSubmitted = computed(() => score.value !== null);
  const canSubmit = computed(() => validateText(answer.value));
  const placeholder = computed(() => {
    if (props.previewMode) return props.question?.correctAnswer || "No correct answer provided";
    return "Enter your answer here...";
  });

  // Watch for changes in preview mode and correct answer
  watch(
    () => [props.previewMode, props.question?.correctAnswer],
    ([newPreviewMode, newCorrectAnswer]) => {
      if (newPreviewMode && newCorrectAnswer) {
        answer.value = newCorrectAnswer;
      } else if (!newPreviewMode) {
        answer.value = "";
        score.value = null;
        error.value = null;
      }
    },
    { immediate: true }
  );

  const resetScore = () => {
    score.value = null;
    submittedAt.value = "";
    error.value = null;
    if (!props.previewMode) {
      answer.value = "";
    }
  };

  const submit = async () => {
    if (!canSubmit.value || isLoading.value) return;
    error.value = null;
    
    try {
      isLoading.value = true;
      
      const requestData = {
        studentAnswer: answer.value.trim(),
        correctAnswer: props.question.correctAnswer || props.question.question,
        question: props.question.question.trim()
      };
      
      // Debug log for request data
      console.log('Sending request to:', `${CONFIG.API_URL}/evaluate`);
      console.log('Request data:', requestData);
      
      if (!requestData.studentAnswer || !requestData.question) {
        throw new Error('Student answer and question are required');
      }
      
      const response = await fetch(`${CONFIG.API_URL}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to evaluate answer');
      }

      const result = await response.json();
      console.log('Response data:', result);
      
      if (result.error) {
        throw new Error(result.error);
      }

      score.value = result.score;
      submittedAt.value = new Date().toISOString();
      
      emit('submit', {
        answer: answer.value.trim(),
        score: result.score,
        question: props.question
      });
    } catch (err) {
      error.value = err.message;
      console.error('Submission error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    answer,
    score,
    isLoading,
    submittedAt,
    isSubmitted,
    canSubmit,
    placeholder,
    submit,
    resetScore,
    error
  };
} 