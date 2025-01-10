<template>
  <div class="spinner-container" :class="{ overlay: isOverlay }">
    <div class="spinner"></div>
    <div v-if="message" class="spinner-message">{{ message }}</div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  isOverlay: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.spinner-container.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-message {
  color: var(--text-color);
  font-size: var(--font-size-sm);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 