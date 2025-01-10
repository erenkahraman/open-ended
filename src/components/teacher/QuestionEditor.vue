<template>
  <div class="editor">
    <BaseInput
      v-model="modelValue.question"
      type="textarea"
      label="Question:"
      placeholder="Enter your question here..."
      :rows="6"
      :error-message="validation.question"
      :disabled="isLoading"
      required
    />
    <BaseInput
      v-model="modelValue.correctAnswer"
      type="textarea"
      label="Correct Answer:"
      placeholder="Enter the correct answer here..."
      :rows="6"
      :error-message="validation.correctAnswer"
      :disabled="isLoading"
      required
    />
    <SampleAnswers 
      v-model="modelValue.sampleAnswers" 
      :selected-question-id="selectedQuestionId"
    />
  </div>
</template>

<script setup>
import { BaseInput } from "../shared";
import SampleAnswers from "./SampleAnswers.vue";

defineProps({
  modelValue: { type: Object, required: true },
  validation: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false },
  selectedQuestionId: { type: [Number, null], default: null }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.editor {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  min-height: 0;
  overflow: hidden;
}

.editor :deep(.base-input) {
  position: relative;
  padding-bottom: var(--spacing-lg);
}

.editor :deep(label) {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  font-size: var(--font-size-md);
  color: var(--text-color);
}

.editor :deep(textarea) {
  resize: none;
  height: 120px;
  max-height: 120px;
  overflow-y: auto;
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--input-background);
  color: var(--text-color);
  font-size: var(--font-size-md);
  line-height: 1.5;
}

.editor :deep(textarea:focus) {
  outline: none;
  border-color: var(--primary-color);
}

.editor :deep(.error-message) {
  position: absolute;
  bottom: 4px;
  left: 0;
  font-size: var(--font-size-sm);
  color: var(--error-color);
}

.editor :deep(textarea:disabled) {
  background: var(--input-background);
  opacity: 0.8;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .editor { 
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }
  
  .editor :deep(textarea) {
    height: 100px;
    max-height: 100px;
  }
}
</style> 