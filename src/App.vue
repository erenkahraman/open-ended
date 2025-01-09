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
    <div class="router-view-container">
      <router-view></router-view>
    </div>
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navigation-tabs {
  height: 49px; /* Fixed navbar height */
  display: flex;
  gap: 1px;
  background-color: var(--tab-inactive-background);
  flex-shrink: 0; /* Prevent navbar from shrinking */
}

.tab-link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  background: var(--tab-inactive-background);
  transition: all 0.2s ease;
}

.tab-link:hover {
  background: var(--tab-active-background);
}

.tab-link.active {
  background: var(--tab-active-background);
  color: var(--primary-color);
}

/* Router view container */
.router-view-container {
  flex: 1;
  min-height: 0; /* Important for nested flex scrolling */
  overflow: hidden;
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