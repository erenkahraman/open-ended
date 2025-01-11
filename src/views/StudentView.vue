<template>
  <div class="student-view">
    <Player 
      v-if="currentQuestion.question"
      :question="currentQuestion"
      @submit="handleSubmit"
    />
    <div v-else class="loading-state">
      No question available
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Player from "../components/student/Player.vue";
import { CONFIG } from "../config/config";

const currentQuestion = ref({
  question: '',
  correctAnswer: ''
});

onMounted(() => {
  const savedQuestion = localStorage.getItem('currentQuestion');
  if (savedQuestion) {
    try {
      currentQuestion.value = JSON.parse(savedQuestion);
    } catch (error) {
      console.error('Error parsing saved question:', error);
    }
  }
});

const handleSubmit = async (submission) => {
  try {
    const response = await fetch(`${CONFIG.API_URL}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentAnswer: submission.answer,
        correctAnswer: currentQuestion.value.correctAnswer,
        question: currentQuestion.value.question
      })
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate answer');
    }

    return await response.json();
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
};
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