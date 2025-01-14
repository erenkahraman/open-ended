<template>
  <button
    class="base-button"
    :class="[variant, size, { loading, block, outlined }]"
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
  variant: { type: String, default: 'primary', validator: v => ['primary', 'danger', 'success', 'neutral'].includes(v) },
  size: { type: String, default: 'md', validator: v => ['sm', 'md', 'lg'].includes(v) },
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
  outlined: Boolean
});

defineEmits(['click']);
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}

.sm { padding: 0.5rem 1rem; font-size: 0.75rem; }
.md { padding: 0.75rem 1.5rem; font-size: 0.875rem; }
.lg { padding: 1rem 2rem; font-size: 1rem; }

.primary { background: var(--primary-color); color: var(--button-text-color); }
.danger { background: var(--danger-color); color: var(--button-text-color); }
.success { background: var(--success-color); color: var(--button-text-color); }
.neutral { background: var(--surface-color); color: var(--text-color); border-color: var(--border-color); }

.primary:hover:not(:disabled) { background: var(--primary-hover-color); }
.danger:hover:not(:disabled) { background: var(--danger-hover-color); }
.success:hover:not(:disabled) { background: var(--success-hover-color); }
.neutral:hover:not(:disabled) { background: var(--secondary-background); }

.base-button:disabled { background: var(--disabled-color); opacity: 0.7; cursor: not-allowed; }
.loading { cursor: wait; }
.block { width: 100%; }

.outlined {
  background: transparent;
  border: 2px solid currentColor;
}

.outlined.primary { color: var(--primary-color); }
.outlined.danger { color: var(--danger-color); }
.outlined.success { color: var(--success-color); }
.outlined:hover:not(:disabled) { background: rgba(0, 0, 0, 0.05); }

.base-button :deep(.spinner) { width: 1em; height: 1em; border-width: 2px; }
.base-button :deep(.spinner-container) { margin: 0; }
</style> 