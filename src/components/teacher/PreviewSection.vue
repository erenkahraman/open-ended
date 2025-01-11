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
            @click="handleAssign"
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

const props = defineProps({
  question: { type: Object, required: true },
  canAssign: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['assign']);

const handleAssign = () => {
  localStorage.setItem('currentQuestion', JSON.stringify(props.question));
  emit('assign');
};
</script>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  height: 100%;
  overflow: hidden;
}

h2 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  flex-shrink: 0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.content :deep(.player-container) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 640px) {
  .preview { padding: var(--spacing-sm); }
}
</style> 