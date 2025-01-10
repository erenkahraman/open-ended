<template>
  <div class="student-view">
    <Player 
      v-if="currentQuestion"
      :question="currentQuestion"
      @submit="handleSubmit"
    />
    <div v-else class="loading-state">
      Loading question...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Player from "../components/student/Player.vue";

const currentQuestion = ref(null);

// Temporary mock question data - replace this with actual API call
const fetchQuestion = async () => {
  // Simulating API call
  return {
    id: 1,
    question: "Explain the concept of semantic evaluation in natural language processing.",
    maxScore: 100,
    category: "NLP"
  };
};

const handleSubmit = async (submission) => {
  // Handle the submission
  console.log('Submission received:', submission);
  // Return mock score for now
  return { score: 85 };
};

onMounted(async () => {
  currentQuestion.value = await fetchQuestion();
});
</script>

<style scoped>
.student-view {
  height: 100vh;
  width: 100%;
  padding: var(--spacing-lg);
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}
</style>