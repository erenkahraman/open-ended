<template>
  <button
    class="base-button"
    :class="[
      variant,
      size,
      { loading, block, outlined }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <LoadingSpinner v-if="loading" />
    <slot v-else />
  </button>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue';

defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'danger', 'success', 'neutral'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  gap: var(--spacing-sm);
}

/* Sizes */
.sm {
  padding: 0.5rem 1rem;
  font-size: var(--font-size-xs);
}

.md {
  padding: 0.75rem 1.5rem;
  font-size: var(--font-size-sm);
}

.lg {
  padding: 1rem 2rem;
  font-size: var(--font-size-md);
}

/* Variants */
.primary {
  background: var(--primary-color);
  color: var(--button-text-color);
}

.primary:hover:not(:disabled) {
  background: var(--primary-hover-color);
}

.danger {
  background: var(--danger-color);
  color: var(--button-text-color);
}

.danger:hover:not(:disabled) {
  background: var(--danger-hover-color);
}

.success {
  background: var(--success-color);
  color: var(--button-text-color);
}

.success:hover:not(:disabled) {
  background: var(--success-hover-color);
}

.neutral {
  background: var(--surface-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.neutral:hover:not(:disabled) {
  background: var(--secondary-background);
}

/* States */
.base-button:disabled {
  background: var(--disabled-color);
  cursor: not-allowed;
  opacity: 0.7;
}

.loading {
  cursor: wait;
}

.block {
  width: 100%;
}

/* Outlined variants */
.outlined {
  background: transparent;
  border: 2px solid currentColor;
}

.outlined.primary {
  color: var(--primary-color);
}

.outlined.danger {
  color: var(--danger-color);
}

.outlined.success {
  color: var(--success-color);
}

.outlined:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}

/* Loading spinner adjustments */
.base-button :deep(.spinner) {
  width: 1em;
  height: 1em;
  border-width: 2px;
}

.base-button :deep(.spinner-container) {
  margin: 0;
}
</style> 