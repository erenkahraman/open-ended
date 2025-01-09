<template>
  <div class="player-container">
    <div v-if="error" class="error-banner">
      {{ error }}
      <button class="error-close" @click="clearError">&times;</button>
    </div>

    <div class="question-section">
      <div class="info-section">
        <div class="info-item">
          Current Date and Time (UTC): {{ userStore.formattedDateTime }}
        </div>
        <div class="info-item">
          Current User's Login: {{ userStore.currentUser }}
        </div>
      </div>

      <h2>Question</h2>
      <div class="question-content">
        <p>{{ displayedQuestion }}</p>
      </div>
    </div>

    <div class="answer-section">
      <div class="input-group">
        <label for="answer">Your Answer:</label>
        <textarea
          id="answer"
          v-model="displayedCorrectAnswer"
          :readonly="previewMode"
          :disabled="!currentQuestion && !previewMode || isSubmitting"
          class="answer-input"
          rows="6"
          placeholder="Type your answer here..."
        ></textarea>
      </div>

      <div class="answer-actions" v-if="!previewMode">
        <button
          class="submit-button"
          :disabled="!canSubmit"
          @click="submitAnswer"
          :class="{ 'loading': isSubmitting }"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </div>

    <ScoreDisplay
      v-if="showScore"
      :score="currentScore"
      :currentDateTime="userStore.formattedDateTime"
      :currentUser="userStore.currentUser"
      @close="resetScore"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuestionStore } from "../../store";
import { useUserStore } from "../../store/modules/user";
import ScoreDisplay from "./ScoreDisplay.vue";
import { evaluateAnswer } from "../../services/semanticService";

const props = defineProps({
  previewMode: {
    type: Boolean,
    default: false,
    required: false
  },
  question: {
    type: Object,
    default: () => ({
      question: '',
      correctAnswer: ''
    }),
    validator(value) {
      if (!value) return true;
      
      return typeof value === 'object' && 
             'question' in value && 
             'correctAnswer' in value &&
             typeof value.question === 'string' &&
             typeof value.correctAnswer === 'string';
    }
  },
});

const emit = defineEmits(["answer-submitted", "error"]);
const questionStore = useQuestionStore();
const userStore = useUserStore();

const answerInput = ref("");
const showScore = ref(false);
const currentScore = ref(0);
const isSubmitting = ref(false);
const error = ref(null);

const currentQuestion = computed(() => questionStore.currentQuestion);

const displayedQuestion = computed(() => {
  if (props.previewMode) {
    return props.question.question || "";
  }
  return currentQuestion.value?.question || "";
});

const displayedCorrectAnswer = computed({
  get() {
    if (props.previewMode) {
      return props.question.correctAnswer || "";
    }
    return answerInput.value;
  },
  set(value) {
    if (!props.previewMode) {
      answerInput.value = value;
    }
  },
});

const canSubmit = computed(() => {
  if (props.previewMode) {
    return false;
  }
  return currentQuestion.value && 
         answerInput.value.trim().length > 0 && 
         !isSubmitting.value;
});

async function submitAnswer() {
  if (!canSubmit.value) return;
  
  try {
    isSubmitting.value = true;
    error.value = null;
    
    if (!currentQuestion.value?.correctAnswer || !currentQuestion.value?.question) {
      console.error('Missing question or correct answer:', currentQuestion.value);
      throw new Error("No correct answer or question available for comparison");
    }

    console.log('Submitting answer with:', {
      studentAnswer: answerInput.value,
      correctAnswer: currentQuestion.value.correctAnswer,
      question: currentQuestion.value.question
    });

    const finalScore = await evaluateAnswer(
      answerInput.value.trim(), 
      currentQuestion.value.correctAnswer.trim(),
      currentQuestion.value.question.trim()
    );
    
    console.log('Received score:', finalScore);
    
    currentScore.value = finalScore;
    showScore.value = true;
    emit("answer-submitted", {
      score: finalScore,
      answer: answerInput.value,
      timestamp: new Date().toISOString(),
      questionId: currentQuestion.value.id
    });
  } catch (err) {
    error.value = err.message || "Failed to submit answer";
    emit("error", error.value);
    console.error("Error submitting answer:", err);
  } finally {
    isSubmitting.value = false;
  }
}

function resetScore() {
  showScore.value = false;
  currentScore.value = 0;
  answerInput.value = "";
  error.value = null;
}

function clearError() {
  error.value = null;
}
</script>

<style scoped>
.player-container {
  height: 90%;
  padding: var(--spacing-lg);
  background-color: var(--secondary-background);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.info-section {
  background: var(--surface-color);
  padding: var(--spacing-md);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-md);
  flex-shrink: 0;
}

.info-item {
  color: var(--text-color);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.info-item:last-child {
  margin-bottom: 0;
}

.question-section {
  flex-shrink: 0;
  margin-bottom: var(--spacing-md);
}

h2 {
  font-size: 1.25rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 600;
}

.question-content {
  background: var(--surface-color);
  color: var(--text-color);
  padding: var(--spacing-lg);
  border-radius: 12px;
  font-size: 1.1rem;
  line-height: 1.6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.answer-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for nested flex scrolling */
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for nested flex scrolling */
}

.input-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.875rem;
  flex-shrink: 0;
}

.answer-input {
  flex: 1;
  padding: var(--spacing-md);
  background: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 150px;
  transition: all 0.2s ease;
}

.answer-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.answer-input:disabled {
  background: var(--disabled-color);
  cursor: not-allowed;
  opacity: 0.7;
}

.answer-actions {
  margin-top: var(--spacing-md);
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  padding: 0.875rem 2rem;
  background: var(--primary-color);
  color: var(--button-text-color);
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: var(--primary-hover-color);
  transform: translateY(-1px);
}

.submit-button:disabled {
  background: var(--disabled-color);
  cursor: not-allowed;
  transform: none;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .player-container {
    padding: 1rem;
  }
}

.error-banner {
  background-color: var(--danger-color);
  color: white;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.error-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
}

.submit-button.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-button.loading:hover {
  transform: none;
}
</style>