<template>
    <div class="card">
      <h3>Sample Questions</h3>
      <div class="button-group">
        <BaseButton
          v-for="question in sampleQuestions"
          :key="question.id"
          @click="$emit('load-sample', question)"
          :disabled="isLoading"
          size="sm"
          variant="neutral"
        >
          Sample {{ question.id }}
        </BaseButton>
        <BaseButton 
          @click="$emit('reset')" 
          variant="danger"
          size="sm"
          :disabled="isLoading"
        >
          Clear
        </BaseButton>
      </div>
    </div>
</template>

<script setup>
import { BaseButton } from "../shared";
import { sampleQuestions } from "../../store/modules/questions";

defineProps({ isLoading: Boolean });
defineEmits(['load-sample', 'reset']);
</script>

<style scoped>
.card {
  background: var(--surface-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

h3 {
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}
</style> 