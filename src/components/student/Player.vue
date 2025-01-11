<template>
  <div class="player-container">
    <div class="question-section">
      <h3>Question:</h3>
      <BaseInput
        :model-value="question.question"
        type="textarea"
        :rows="6"
        readonly
        :disabled="true"
        :placeholder="'No question provided'"
      />
    </div>

    <div class="answer-section">
      <h3>{{ previewMode ? 'Correct Answer:' : 'Your Answer:' }}</h3>
      <BaseInput
        v-model="answer"
        type="textarea"
        :rows="6"
        :disabled="isSubmitted || isLoading || disableQuestion"
        :readonly="previewMode"
        :placeholder="placeholder"
      />
    </div>

    <div class="actions">
      <slot name="preview-actions">
        <BaseButton
          @click="submit"
          :loading="isLoading"
          :disabled="!canSubmit"
          block
          size="lg"
        >
          Submit Answer
        </BaseButton>
      </slot>
    </div>

    <ScoreDisplay
      v-if="score !== null"
      :score="score"
      :current-date-time="submittedAt"
      :current-user="userStore.currentUser"
      @close="resetScore"
    />
  </div>
</template>

<script setup>
import { useUserStore } from "../../store/modules/user";
import { BaseButton, BaseInput } from "../shared";
import ScoreDisplay from "./ScoreDisplay.vue";
import { useAnswerSubmission } from "../../composables/useAnswerSubmission";

const props = defineProps({
  question: { 
    type: Object, 
    required: true,
    validator: (value) => {
      return value && typeof value.question === 'string';
    }
  },
  previewMode: { type: Boolean, default: false },
  disableQuestion: { type: Boolean, default: false }
});

const emit = defineEmits(['submit']);
const userStore = useUserStore();

const {
  answer,
  score,
  isLoading,
  submittedAt,
  isSubmitted,
  canSubmit,
  placeholder,
  submit,
  resetScore
} = useAnswerSubmission(props, emit);
</script>

<style scoped>
.player-container {
  display: grid;
  grid-template-rows: auto auto auto auto;
  gap: var(--spacing-md);
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.question-section, .answer-section {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--spacing-sm);
  min-height: 0;
}

h3 {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color);
}

:deep(textarea) {
  composes: form-textarea from '../../assets/styles/components.css';
}

.actions {
  margin-top: var(--spacing-md);
}
</style>