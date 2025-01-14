<template>
  <div class="preview">
    <h2>Preview</h2>
    <div class="content">
      <Player 
        :preview-mode="true" 
        :question="question"
        :disable-question="true"
      >
        <template #preview-actions>
          <BaseButton
            @click="$emit('assign')"
            :disabled="!canAssign"
            :loading="isLoading"
            block
            size="lg"
          >
            Assign the Question
          </BaseButton>
        </template>
      </Player>
    </div>
  </div>
</template>

<script setup>
import { BaseButton } from "../shared";
import Player from "../student/Player.vue";

defineProps({
  question: { type: Object, required: true },
  canAssign: Boolean,
  isLoading: Boolean
});

defineEmits(['assign']);
</script>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  height: 100%;
  overflow: hidden;
}

h2 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.content {
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .preview { padding: var(--spacing-sm); }
}
</style> 