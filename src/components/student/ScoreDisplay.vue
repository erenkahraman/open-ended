<template>
  <div class="score-display-overlay">
    <div class="score-display-content">
      <h2>Your Score: {{ score }}</h2>
      <p>Date/Time: {{ currentDateTime }}</p>
      <p>User: {{ currentUser }}</p>
      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  score: {
    type: Number,
    default: 0,
  },
  currentDateTime: {
    type: String,
    default: "",
  },
  currentUser: {
    type: String,
    default: "",
  },
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
  z-index: 999;
}

.score-display-content {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: 12px;
  color: var(--text-color);
  text-align: center;
  max-width: 400px;
  width: 90%;
}
</style>