<template>
  <div class="editor">
    <BaseInput
      :model-value="modelValue.question"
      @update:modelValue="emit('update:modelValue', { ...modelValue, question: $event })"
      type="textarea"
      label="Question:"
      placeholder="Enter your question here..."
      :rows="6"
      :error-message="validation.question"
      :disabled="isLoading"
      required
    />
    <BaseInput
      :model-value="modelValue.correctAnswer"
      @update:modelValue="emit('update:modelValue', { ...modelValue, correctAnswer: $event })"
      type="textarea"
      label="Correct Answer:"
      placeholder="Enter the correct answer here..."
      :rows="6"
      :error-message="validation.correctAnswer"
      :disabled="isLoading"
      required
    />
    <SampleAnswers 
      :model-value="modelValue.sampleAnswers"
      @update:modelValue="emit('update:modelValue', { ...modelValue, sampleAnswers: $event })"
      :selected-question-id="selectedQuestionId"
    />
  </div>
</template>

<script setup>
import { BaseInput } from "../shared";
import SampleAnswers from "./SampleAnswers.vue";

const props = defineProps({
  modelValue: { type: Object, required: true },
  validation: { type: Object, default: () => ({}) },
  isLoading: Boolean,
  selectedQuestionId: { type: [Number, null], default: null }
});

const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.editor {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  min-height: 0;
  overflow: auto;
}
</style> 