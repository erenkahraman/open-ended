<template>
  <div class="sample-answers">
    <h3>Sample Answers</h3>
    <p class="helper-text">
      Provide sample answers for different proficiency levels
    </p>

    <div class="answers-grid">
      <div v-for="level in answerLevels" :key="level.name" class="answer-group">
        <div class="level-header">
          <span class="level-name">{{ level.name }}</span>
          <span class="level-range">{{ level.range }}/10</span>
        </div>

        <textarea
          v-model="answers[level.name]"
          :placeholder="`Enter a ${level.name.toLowerCase()} answer...`"
          :class="{ error: showErrors && !answers[level.name] }"
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

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const answerLevels = [
  { name: "Excellent", range: "9-10", defaultScore: 9.5 },
  { name: "Good", range: "7-8", defaultScore: 7.5 },
  { name: "Fair", range: "5-6", defaultScore: 5.5 },
  { name: "Poor", range: "3-4", defaultScore: 3.5 },
  { name: "Very Poor", range: "0-2", defaultScore: 1.5 },
];

const answers = ref({});
const showErrors = ref(false);

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
  border-top: 1px solid #e2e8f0;
  padding-top: 2rem;
}

.helper-text {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.answers-grid {
  display: grid;
  gap: 1.5rem;
}

.answer-group {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.level-name {
  font-weight: 500;
  color: #334155;
}

.level-range {
  color: #64748b;
  font-size: 0.875rem;
}

textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  resize: vertical;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

@media (min-width: 768px) {
  .answers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>