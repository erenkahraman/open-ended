<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist or has been moved.</p>
    <router-link to="/" class="home-link">Go to Home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
  background: var(--surface-color);
}

h1 {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
}

p {
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: var(--spacing-lg);
}

.home-link {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--primary-color);
  color: var(--button-text-color);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.home-link:hover {
  background: var(--primary-hover-color);
  transform: translateY(-1px);
}
</style> 