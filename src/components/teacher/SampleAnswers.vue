<template>
  <div class="sample-answers">
    <h3>Sample Answers (Optional)</h3>
    <p class="helper-text">
      Select sample answers for different proficiency levels
    </p>

    <div class="answers-grid">
      <div v-for="level in answerLevels" :key="level.name" class="answer-group">
        <div class="level-header">
          <span class="level-name">{{ level.name }}</span>
          <span class="level-range">{{ level.range }}/10</span>
        </div>

        <BaseInput
          v-model="answers[level.name]"
          type="select"
          :options="getSampleAnswersForLevel(level.name)"
          option-label="answer"
          option-value="answer"
          placeholder="Select a sample answer..."
          :error-message="showErrors && !answers[level.name] ? 'Required for complete evaluation' : ''"
          @focus="handleDropdownFocus(level.name)"
          @blur="handleDropdownBlur"
        />

        <BaseInput
          v-if="answers[level.name]"
          :model-value="answers[level.name]"
          type="textarea"
          :rows="3"
          readonly
          @click="handleTextareaClick"
          class="answer-display"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { sampleQuestions } from "../../store/modules/questions";
import { BaseInput } from "../shared";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  selectedQuestionId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(["update:modelValue"]);

const answerLevels = [
  { name: "Excellent", range: "9-10", defaultScore: 9.5 },
  { name: "Good", range: "7-8", defaultScore: 7.5 },
  { name: "Fair", range: "5-6", defaultScore: 5.5 }
];

const answers = ref({});
const showErrors = ref(false);
const activeDropdown = ref(null);

function handleDropdownFocus(levelName) {
  if (activeDropdown.value && activeDropdown.value !== levelName) {
    // Close other dropdowns
    const event = new Event('blur');
    document.querySelector(`[data-level="${activeDropdown.value}"]`)?.dispatchEvent(event);
  }
  activeDropdown.value = levelName;
}

function handleDropdownBlur() {
  setTimeout(() => {
    activeDropdown.value = null;
  }, 200);
}

function handleTextareaClick(event) {
  if (!event.target) return;
  event.target.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Failed to copy text:', err);
  }
}

function getSampleAnswersForLevel(level) {
  if (!props.selectedQuestionId) return [];
  
  const selectedQuestion = sampleQuestions.find(q => q.id === props.selectedQuestionId);
  if (!selectedQuestion) return [];

  return selectedQuestion.sampleAnswers.filter(a => a.level === level);
}

// Initialize answers from props
watch(
  () => props.modelValue,
  (newValue) => {
    answerLevels.forEach((level) => {
      const existingAnswer = newValue.find((a) => a.level === level.name);
      answers.value[level.name] = existingAnswer ? existingAnswer.answer : "";
    });
  },
  { immediate: true }
);

// Reset answers when question changes
watch(
  () => props.selectedQuestionId,
  () => {
    answerLevels.forEach((level) => {
      answers.value[level.name] = "";
    });
    activeDropdown.value = null;
  }
);

// Update parent when answers change
watch(
  answers,
  (newAnswers) => {
    const formattedAnswers = Object.entries(newAnswers)
      .map(([level, answer]) => {
        const levelConfig = answerLevels.find((l) => l.name === level);
        return {
          level,
          answer,
          score: levelConfig?.defaultScore || 0,
        };
      })
      .filter((answer) => answer.answer?.trim());

    emit("update:modelValue", formattedAnswers);
  },
  { deep: true }
);
</script>

<style scoped>
.sample-answers {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.helper-text {
  color: var(--text-color);
  opacity: 0.7;
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.answers-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  overflow-y: auto;
  padding-right: var(--spacing-sm);
}

.answer-group {
  background: var(--surface-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.level-name {
  font-weight: 500;
  color: var(--text-color);
}

.level-range {
  color: var(--text-color);
  opacity: 0.7;
  font-size: var(--font-size-sm);
}

.answer-display {
  margin-top: var(--spacing-sm);
  cursor: pointer;
}

.answer-display:hover {
  border-color: var(--primary-color);
}

.answer-display :deep(textarea) {
  height: 80px;
  max-height: 80px;
  resize: none;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .answers-grid {
    gap: var(--spacing-sm);
  }

  .answer-group {
    padding: var(--spacing-sm);
  }
  
  .answer-display :deep(textarea) {
    height: 60px;
    max-height: 60px;
  }
}
</style>