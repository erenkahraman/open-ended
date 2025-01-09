<template>
  <div class="customizer-container">
    <div v-if="error" class="error-banner">
      {{ error }}
      <button class="close-button" @click="error = null">&times;</button>
    </div>

    <div v-if="successMessage" class="success-banner">
      {{ successMessage }}
      <button class="close-button" @click="successMessage = ''">&times;</button>
    </div>

    <div class="main-content">
      <div class="left-panel">
        <div class="card info-section">
          <div class="info-item">
            Current Date and Time (UTC): {{ userStore.formattedDateTime }}
          </div>
          <div class="info-item">
            Current User's Login: {{ userStore.currentUser }}
          </div>
        </div>

        <div class="card">
          <h3>Sample Questions</h3>
          <div class="button-group">
            <button
              v-for="question in sampleQuestions"
              :key="question.id"
              @click="loadSampleQuestion(question)"
              class="button"
              :disabled="isLoading"
            >
              Sample {{ question.id }}
            </button>
            <button 
              @click="resetForm" 
              class="button danger"
              :disabled="isLoading"
            >
              Clear
            </button>
          </div>
        </div>

        <div class="question-editor card">
          <div class="input-group">
            <label for="question">Question:</label>
            <textarea
              id="question"
              v-model="questionInput"
              placeholder="Enter your question here..."
              rows="3"
              class="textarea-input"
              :class="{ 'error': validation.question }"
              :disabled="isLoading"
            ></textarea>
            <span v-if="validation.question" class="error-text">
              {{ validation.question }}
            </span>
          </div>

          <div class="input-group">
            <label for="correctAnswer">Correct Answer:</label>
            <textarea
              id="correctAnswer"
              v-model="correctAnswerInput"
              placeholder="Enter the correct answer here..."
              rows="4"
              class="textarea-input"
              :class="{ 'error': validation.correctAnswer }"
              :disabled="isLoading"
            ></textarea>
            <span v-if="validation.correctAnswer" class="error-text">
              {{ validation.correctAnswer }}
            </span>
          </div>

          <SampleAnswers 
            v-model="sampleAnswers" 
            :selected-question-id="selectedQuestionId" 
          />
        </div>
      </div>

      <div class="right-panel">
        <div class="preview-wrapper card">
          <h2>Preview</h2>
          <div class="preview-content">
            <Player :preview-mode="true" :question="questionForPreview" />
          </div>
        </div>
        <div class="action-buttons card">
          <button
            @click="assignQuestion"
            :disabled="!canAssign"
            class="button w-full"
            :class="{ 'loading': isLoading }"
          >
            {{ isLoading ? 'Assigning...' : 'Assign the Question' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuestionStore } from "../../store";
import { useUserStore } from "../../store/modules/user";
import { sampleQuestions } from "../../store/modules/questions";
import Player from "../student/Player.vue";
import SampleAnswers from "./SampleAnswers.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const questionStore = useQuestionStore();
const userStore = useUserStore();

const questionInput = ref("");
const correctAnswerInput = ref("");
const sampleAnswers = ref([
  { level: "Excellent", score: 9.5, answer: "" },
  { level: "Good", score: 7.5, answer: "" },
  { level: "Fair", score: 5.5, answer: "" },
]);

const error = ref(null);
const isLoading = ref(false);
const successMessage = ref("");
const selectedQuestionId = ref(null);

// Form validation
const validation = computed(() => {
  const errors = {};
  
  if (!questionInput.value.trim()) {
    errors.question = "Question is required";
  } else if (questionInput.value.trim().length < 10) {
    errors.question = "Question is too short";
  }
  
  if (!correctAnswerInput.value.trim()) {
    errors.correctAnswer = "Correct answer is required";
  } else if (correctAnswerInput.value.trim().length < 20) {
    errors.correctAnswer = "Correct answer should be more detailed";
  }
  
  return errors;
});

const hasErrors = computed(() => Object.keys(validation.value).length > 0);

const questionForPreview = computed(() => ({
  id: Date.now(),
  question: questionInput.value,
  correctAnswer: correctAnswerInput.value,
  sampleAnswers: sampleAnswers.value,
}));

async function loadSampleQuestion(question) {
  try {
    selectedQuestionId.value = question.id;
    questionInput.value = question.question;
    correctAnswerInput.value = question.correctAnswer;
    sampleAnswers.value = question.sampleAnswers.map((a) => ({ ...a }));
    error.value = null;
    successMessage.value = "Sample question loaded successfully";
    setTimeout(() => successMessage.value = "", 3000);
  } catch (err) {
    error.value = "Failed to load sample question";
    console.error("Error loading sample question:", err);
  }
}

const canAssign = computed(() => {
  return !hasErrors.value && !isLoading.value;
});

async function assignQuestion() {
  if (!canAssign.value) return;
  
  try {
    isLoading.value = true;
    error.value = null;

    const newQuestion = {
      question: questionInput.value,
      correctAnswer: correctAnswerInput.value,
      sampleAnswers: sampleAnswers.value.filter(a => a.answer.trim()),
      createdBy: userStore.currentUser,
      createdAt: new Date().toISOString(),
    };

    await questionStore.addQuestion(newQuestion);
    successMessage.value = "Question assigned successfully";
    await router.push("/student");
  } catch (err) {
    error.value = err.message || "Failed to assign question";
    console.error("Error assigning question:", err);
  } finally {
    isLoading.value = false;
  }
}

function resetForm() {
  try {
    selectedQuestionId.value = null;
    questionInput.value = "";
    correctAnswerInput.value = "";
    sampleAnswers.value = sampleAnswers.value.map((answer) => ({
      ...answer,
      answer: "",
    }));
    error.value = null;
    successMessage.value = "Form reset successfully";
    setTimeout(() => successMessage.value = "", 3000);
  } catch (err) {
    error.value = "Failed to reset form";
    console.error("Error resetting form:", err);
  }
}
</script>

<style scoped>
.customizer-container {
  height: 100%;
  padding: var(--spacing-md);
  background-color: var(--secondary-background);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: var(--spacing-md);
  max-width: 1600px;
  margin: 0 auto;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  height: 90%;
  min-height: 0;
  overflow: hidden;
}

.card {
  background: var(--surface-color);
  border-radius: 12px;
  padding: var(--spacing-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-section {
  flex-shrink: 0;
  padding: var(--spacing-sm);
}

.info-section .info-item {
  font-size: 0.8rem;
  margin-bottom: var(--spacing-xs);
}

.sample-questions {
  flex-shrink: 0;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.button-group .button {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
}

.question-editor {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: auto;
  gap: var(--spacing-sm);
}

.input-group {
  flex-shrink: 0;
  margin-bottom: var(--spacing-sm);
}

.input-group label {
  font-size: 0.9rem;
  margin-bottom: var(--spacing-xs);
}

.textarea-input {
  width: 100%;
  min-height: 60px;
  padding: var(--spacing-sm);
  font-size: 0.9rem;
  line-height: 1.4;
}

.preview-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.preview-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.preview-content :deep(.player-container) {
  height: 100%;
  padding: var(--spacing-sm);
}

.preview-content :deep(.question-section) {
  margin-bottom: var(--spacing-sm);
}

.preview-content :deep(.answer-input) {
  min-height: 100px;
}

h2, h3 {
  font-size: 1rem;
  margin-bottom: var(--spacing-sm);
}

/* Sample Answers adjustments */
:deep(.sample-answers) {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
}

:deep(.answers-grid) {
  gap: var(--spacing-sm);
}

:deep(.answer-group) {
  padding: var(--spacing-sm);
}

:deep(.helper-text) {
  font-size: 0.8rem;
  margin-bottom: var(--spacing-sm);
}

/* Make the grid layout more responsive */
@media (max-width: 1200px) {
  .customizer-container {
    height: auto;
    overflow: auto;
  }

  .main-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .left-panel, .right-panel {
    height: auto;
    overflow: visible;
  }

  .preview-wrapper {
    height: 400px;
  }
}

@media (max-width: 640px) {
  .preview-wrapper {
    height: 300px;
  }

  .textarea-input {
    min-height: 50px;
  }

  :deep(.answer-input) {
    min-height: 80px;
  }
}
</style>