<template>
  <div class="app-container">
    <nav class="navigation-tabs">
      <router-link
        to="/teacher"
        class="tab-link"
        :class="{ active: currentRoute === '/teacher' }"
      >
        Teacher
      </router-link>
      <router-link
        to="/student"
        class="tab-link"
        :class="{ active: currentRoute === '/student' }"
      >
        Student
      </router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useQuestionStore } from "./store";
import { computed } from "vue";
import { useRoute } from "vue-router";

const questionStore = useQuestionStore();
const route = useRoute();

const currentRoute = computed(() => route.path);
</script>

<style>
:root {
  --surface-color: #ffffff;
  --text-color: #2c3e50;
  --primary-color: #3498db;
  --primary-hover-color: #2980b9;
  --danger-color: #e74c3c;
  --danger-hover-color: #c0392b;
  --disabled-color: #94a3b8;
  --border-color: #e2e8f0;
  --input-background: #f8fafc;
  --button-text-color: #ffffff;
  --secondary-background: #f1f5f9;
  --tab-active-background: #ffffff;
  --tab-inactive-background: #e2e8f0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface-color: #1a202c;
    --text-color: #e2e8f0;
    --primary-color: #3498db;
    --primary-hover-color: #2980b9;
    --danger-color: #e74c3c;
    --danger-hover-color: #c0392b;
    --disabled-color: #4a5568;
    --border-color: #2d3748;
    --input-background: #2d3748;
    --button-text-color: #ffffff;
    --secondary-background: #1e293b;
    --tab-active-background: #2d3748;
    --tab-inactive-background: #1a202c;
  }
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--secondary-background);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
}

#app {
  height: 100vh;
  width: 100%;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navigation-tabs {
  background-color: var(--surface-color);
  padding: 1rem 2rem 0;
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.tab-link {
  padding: 0.75rem 2rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: var(--tab-inactive-background);
  position: relative;
  bottom: -1px;
}

.tab-link:hover {
  background-color: var(--tab-active-background);
}

.tab-link.active {
  background-color: var(--tab-active-background);
  border: 1px solid var(--border-color);
  border-bottom-color: var(--tab-active-background);
}

* {
  box-sizing: border-box;
}

@media (max-width: 640px) {
  .navigation-tabs {
    padding: 1rem 1rem 0;
  }

  .tab-link {
    padding: 0.75rem 1rem;
    font-size: 0.813rem;
  }
}
</style>