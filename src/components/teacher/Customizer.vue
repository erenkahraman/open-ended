<template>
  <div class="customizer-container">
    <div class="main-content">
      <div class="left-panel">
        <div class="info-section">
          <div class="info-item">
            Current Date and Time (UTC): 2025-01-09 11:39:03
          </div>
          <div class="info-item">Current User's Login: erenkahraman</div>
        </div>

        <div class="sample-buttons">
          <h3>Sample Questions</h3>
          <div class="button-group">
            <button
              v-for="question in sampleQuestions"
              :key="question.id"
              @click="loadSampleQuestion(question)"
              class="sample-button"
            >
              Sample {{ question.id }}
            </button>
            <button @click="resetForm" class="sample-button reset">
              Clear
            </button>
          </div>
        </div>

        <div class="question-editor">
          <div class="input-group">
            <label for="question">Question:</label>
            <textarea
              id="question"
              v-model="questionInput"
              placeholder="Enter your question here..."
              rows="3"
              class="question-input"
            ></textarea>
          </div>

          <div class="input-group">
            <label for="correctAnswer">Correct Answer:</label>
            <textarea
              id="correctAnswer"
              v-model="correctAnswerInput"
              placeholder="Enter the correct answer here..."
              rows="4"
              class="answer-input"
            ></textarea>
          </div>

          <div class="sample-answers">
            <h3>Sample Answers</h3>
            <div
              v-for="(answer, index) in sampleAnswers"
              :key="index"
              class="sample-answer-item"
            >
              <textarea
                v-model="answer.answer"
                :placeholder="`Enter a ${answer.level.toLowerCase()} sample answer...`"
                rows="3"
                class="sample-answer-input"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="preview-section">
          <h2>Preview</h2>
          <Player :preview-mode="true" :question="questionForPreview" />
        </div>
        <div class="action-buttons">
          <button
            @click="assignQuestion"
            :disabled="!canAssign"
            class="save-button"
          >
            Assign the Question
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useQuestionStore } from "../../store";
import { sampleQuestions } from "../../store/modules/questions";
import Player from "../student/Player.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const emit = defineEmits(["switch-mode"]);
const questionStore = useQuestionStore();

const questionInput = ref("");
const correctAnswerInput = ref("");
const sampleAnswers = ref([
  { level: "Excellent", score: 9.5, answer: "" },
  { level: "Good", score: 7.5, answer: "" },
  { level: "Fair", score: 5.5, answer: "" },
]);

watch(
  [questionInput, correctAnswerInput, sampleAnswers],
  () => {
    questionStore.setPreviewQuestion({
      question: questionInput.value,
      correctAnswer: correctAnswerInput.value,
      sampleAnswers: sampleAnswers.value,
    });
  },
  { deep: true }
);

function loadSampleQuestion(question) {
  questionInput.value = question.question;
  correctAnswerInput.value = question.correctAnswer;
  sampleAnswers.value = question.sampleAnswers.map((a) => ({ ...a }));
}

const canAssign = computed(() => {
  return (
    questionInput.value.trim() &&
    correctAnswerInput.value.trim() &&
    sampleAnswers.value.every((a) => a.answer.trim())
  );
});

const questionForPreview = computed(() => {
  return {
    question: questionInput.value,
    correctAnswer: correctAnswerInput.value,
    sampleAnswers: sampleAnswers.value,
  };
});

async function assignQuestion() {
  if (!canAssign.value) return;

  const newQuestion = {
    question: questionInput.value,
    correctAnswer: correctAnswerInput.value,
    sampleAnswers: [...sampleAnswers.value],
    createdBy: "erenkahraman",
    createdAt: "2025-01-09 11:50:51",
  };

  questionStore.addQuestion(newQuestion);
  await router.push("/student");
}

function resetForm() {
  questionInput.value = "";
  correctAnswerInput.value = "";
  sampleAnswers.value = sampleAnswers.value.map((answer) => ({
    ...answer,
    answer: "",
  }));
}
</script>

<style scoped>
.customizer-container {
  min-height: calc(100vh - 49px); /* tab yüksekliğini çıkardık */
  padding: 1.5rem;
  background-color: var(--secondary-background);
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
  min-height: calc(100vh - 13rem);
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.right-panel {
  position: sticky;
  top: 1.5rem;
  height: calc(100vh - 13rem);
  display: flex;
  flex-direction: column;
}

.info-section {
  background: var(--surface-color);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.sample-buttons {
  background: var(--surface-color);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.sample-button {
  background: var(--primary-color);
  border: none;
  border-radius: 8px;
  color: var(--button-text-color);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.625rem 1rem;
  transition: all 0.2s ease;
}

.sample-button:hover:not(:disabled) {
  background: var(--primary-hover-color);
  transform: translateY(-1px);
}

.sample-button.reset {
  background: var(--danger-color);
}

.sample-button.reset:hover {
  background: var(--danger-hover-color);
}

.input-group {
  background: var(--surface-color);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

label {
  color: var(--text-color);
  display: block;
  font-weight: 500;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.question-input,
.answer-input,
.sample-answer-input {
  width: 100%;
  background: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0.875rem;
  resize: vertical;
  transition: all 0.2s ease;
}

.question-input {
  min-height: 80px;
}

.answer-input {
  min-height: 100px;
}

.sample-answer-input {
  min-height: 80px;
}

.question-input:focus,
.answer-input:focus,
.sample-answer-input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.sample-answers {
  background: var(--surface-color);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sample-answer-item {
  margin-bottom: 1rem;
}

.sample-answer-item:last-child {
  margin-bottom: 0;
}

h2,
h3 {
  color: var(--text-color);
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.preview-section {
  background: var(--surface-color);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.action-buttons {
  background: var(--surface-color);
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.save-button {
  width: 100%;
  background: var(--primary-color);
  border: none;
  border-radius: 8px;
  color: var(--button-text-color);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.875rem 1.5rem;
  transition: all 0.2s ease;
}

.save-button:hover:not(:disabled) {
  background: var(--primary-hover-color);
  transform: translateY(-1px);
}

.save-button:disabled {
  background: var(--disabled-color);
  cursor: not-allowed;
  transform: none;
  opacity: 0.7;
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .right-panel {
    position: static;
    height: auto;
  }
}

@media (max-width: 640px) {
  .customizer-container {
    padding: 1rem;
  }

  .main-content {
    gap: 1rem;
  }

  .left-panel {
    gap: 1rem;
  }
}
</style>