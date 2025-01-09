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

        <div class="select-wrapper">
          <select
            v-model="answers[level.name]"
            class="answer-select"
            :class="{ error: showErrors && !answers[level.name] }"
          >
            <option value="">Select a sample answer...</option>
            <option v-for="answer in getSampleAnswersForLevel(level.name)" 
              :key="answer.answer"
              :value="answer.answer"
            >
              {{ answer.answer }}
            </option>
          </select>
          <div class="select-arrow"></div>
        </div>

        <textarea
          v-if="answers[level.name]"
          :value="answers[level.name]"
          readonly
          class="answer-display"
          rows="3"
          @click="handleTextareaClick"
        ></textarea>

        <span v-if="showErrors && !answers[level.name]" class="error-message">
          Required for complete evaluation
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { sampleQuestions } from "../../store/modules/questions";

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

function handleTextareaClick(event) {
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
          score: levelConfig.defaultScore,
        };
      })
      .filter((answer) => answer.answer.trim());

    emit("update:modelValue", formattedAnswers);
  },
  { deep: true }
);
</script>

<style scoped>
.sample-answers {
  margin-top: 2rem;
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
}

.helper-text {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.answers-grid {
  display: grid;
  gap: 1.5rem;
}

.answer-group {
  background: var(--surface-color);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.level-name {
  font-weight: 500;
  color: var(--text-color);
}

.level-range {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.875rem;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.answer-select {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  background: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.875rem;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.answer-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.answer-select.error {
  border-color: var(--danger-color);
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--text-color);
  pointer-events: none;
}

.error-message {
  color: var(--danger-color);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.answer-display {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: var(--input-background);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
  font-size: 0.875rem;
  resize: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.answer-display:hover {
  background: var(--surface-color);
  border-color: var(--primary-color);
}

.answer-display:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

@media (min-width: 768px) {
  .answers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>