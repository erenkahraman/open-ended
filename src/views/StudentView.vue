<template>
  <div class="student-view">
    <Player 
      v-if="currentQuestion.question"
      :question="currentQuestion"
      @submit="handleSubmit"
      class="main-content"
    />
    <div v-else class="main-content waiting">
      Waiting for question...
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
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-color);
  display: flex;
  justify-content: center;
}

.main-content {
  width: 100%;
  max-width: 800px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 2rem;
}

.waiting {
  text-align: center;
  color: var(--text-color-secondary);
}

@media (max-width: 768px) {
  .student-view {
    padding: 1rem;
  }
  
  .main-content {
    padding: 1.5rem;
  }
}
</style>