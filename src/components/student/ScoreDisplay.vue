<template>
  <div class="score-display-overlay" @click.self="$emit('close')" role="dialog" aria-labelledby="score-title">
    <div class="score-display-content">
      <div class="score-header">
        <h2 id="score-title">Your Score</h2>
        <div class="score-value" :class="scoreClass" role="status" aria-live="polite">
          {{ formattedScore }}
        </div>
      </div>

      <div class="score-details">
        <div class="detail-item">
          <span class="detail-label">Date/Time:</span>
          <span class="detail-value">{{ currentDateTime || 'N/A' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">User:</span>
          <span class="detail-value">{{ currentUser || 'N/A' }}</span>
        </div>
      </div>

      <BaseButton
        @click="$emit('close')"
        variant="neutral"
        block
        aria-label="Close score display"
      >
        Close
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { BaseButton } from '../shared';

const props = defineProps({
  score: {
    type: [Number, null],
    required: true,
    default: null,
    validator: value => value === null || (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10)
  },
  currentDateTime: {
    type: String,
    required: true,
    validator: value => typeof value === 'string' && value.length > 0
  },
  currentUser: {
    type: String,
    required: true,
    validator: value => typeof value === 'string' && value.length > 0
  }
});

defineEmits(['close']);

const formattedScore = computed(() => {
  if (props.score === null || !Number.isFinite(props.score)) return 'N/A';
  return props.score.toFixed(1);
});

const scoreClass = computed(() => {
  if (props.score === null || !Number.isFinite(props.score)) return 'neutral';
  if (props.score >= 8) return 'excellent';
  if (props.score >= 6) return 'good';
  return 'fair';
});
</script>

<style scoped>
.score-display-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.score-display-content {
  background: var(--surface-color);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  color: var(--text-color);
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.score-header {
  text-align: center;
}

h2 {
  font-size: var(--font-size-lg);
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  font-weight: 600;
}

.score-value {
  font-size: var(--font-size-xl);
  font-weight: 700;
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  margin: var(--spacing-md) 0;
}

.score-value.excellent {
  color: var(--success-color);
  background: var(--success-background);
}

.score-value.good {
  color: var(--primary-color);
  background: var(--primary-background);
}

.score-value.fair {
  color: var(--warning-color);
  background: var(--warning-background);
}

.score-value.neutral {
  color: var(--text-color);
  background: var(--secondary-background);
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--secondary-background);
  border-radius: var(--radius-md);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
}

.detail-label {
  color: var(--text-color);
  opacity: 0.7;
  font-weight: 500;
}

.detail-value {
  color: var(--text-color);
}

@media (max-width: 640px) {
  .score-display-content {
    padding: var(--spacing-lg);
    gap: var(--spacing-md);
  }

  .score-value {
    font-size: var(--font-size-lg);
    padding: var(--spacing-sm);
  }
}
</style>