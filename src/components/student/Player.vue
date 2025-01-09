<template>
  <div class="player-container">
    <div class="question-section">
      <div class="info-section">
        <div class="info-item">
          Current Date and Time (UTC): 2025-01-09 11:38:06
        </div>
        <div class="info-item">Current User's Login: erenkahraman</div>
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
          :disabled="!currentQuestion && !previewMode"
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
        >
          Submit
        </button>
      </div>
    </div>

    <ScoreDisplay
      v-if="showScore"
      :score="currentScore"
      :currentDateTime="'2025-01-09 11:38:06'"
      :currentUser="'erenkahraman'"
      @close="resetScore"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuestionStore } from "../../store";
import ScoreDisplay from "./ScoreDisplay.vue";
import { evaluateAnswer } from "../../services/semanticService";

const props = defineProps({
  previewMode: {
    type: Boolean,
    default: false,
  },
  question: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["answer-submitted"]);
const questionStore = useQuestionStore();
const answerInput = ref("");
const showScore = ref(false);
const currentScore = ref(0);
const currentQuestion = computed(() => questionStore.currentQuestion);

const displayedQuestion = computed(() => {
  if (props.previewMode) {
    return questionStore.previewQuestion?.question || "";
  }
  return currentQuestion.value?.question || "";
});

const displayedCorrectAnswer = computed({
  get() {
    if (props.previewMode) {
      return questionStore.previewQuestion?.correctAnswer || "";
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
  return currentQuestion.value && answerInput.value.trim().length > 0;
});

async function submitAnswer() {
  if (!canSubmit.value) return;
  try {
    const correctAnswer = currentQuestion.value?.correctAnswer || "";
    const finalScore = await evaluateAnswer(answerInput.value, correctAnswer);
    currentScore.value = finalScore;
    showScore.value = true;
    emit("answer-submitted", finalScore);
  } catch (error) {
    console.error("Error submitting answer:", error);
  }
}

function resetScore() {
  showScore.value = false;
  currentScore.value = 0;
  answerInput.value = "";
}
</script>

<style scoped>
.player-container {
  min-height: calc(100vh - 49px);
  padding: 1.5rem;
  background-color: var(--secondary-background);
}

.info-section {
  background: var(--surface-color);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  max-width: 1000px;
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
  max-width: 1000px;
  margin: 0 auto 2rem;
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
  padding: 1.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  line-height: 1.6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.answer-section {
  max-width: 1000px;
  margin: 0 auto 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.875rem;
}

.answer-input {
  width: 100%;
  padding: 1rem;
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
</style>