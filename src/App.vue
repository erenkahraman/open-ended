<template>
  <div class="app-container">
    <nav class="navigation-tabs">
      <router-link
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        class="tab-link"
        :class="{ active: currentRoute === route.path }"
      >
        {{ route.name }}
      </router-link>
    </nav>
    <div class="router-view-container">
      <Suspense>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "./store/modules/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const currentRoute = computed(() => route.path);

const routes = [
  { path: '/teacher', name: 'Teacher' },
  { path: '/student', name: 'Student' }
];

// Update activity timestamp on route change
onMounted(() => {
  router.afterEach(() => {
    userStore.updateActivity();
  });
});
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
  --success-color: #22c55e;
  --success-hover-color: #16a34a;
  --warning-color: #f59e0b;
  --warning-hover-color: #d97706;
  --success-background: rgba(34, 197, 94, 0.1);
  --primary-background: rgba(52, 152, 219, 0.1);
  --warning-background: rgba(245, 158, 11, 0.1);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --surface-color: #1a202c;
    --text-color: #e2e8f0;
    --input-background: #2d3748;
    --border-color: #2d3748;
    --secondary-background: #1e293b;
    --tab-active-background: #2d3748;
    --tab-inactive-background: #1a202c;
    --success-background: rgba(34, 197, 94, 0.05);
    --primary-background: rgba(52, 152, 219, 0.05);
    --warning-background: rgba(245, 158, 11, 0.05);
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
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
  height: 49px;
  display: flex;
  gap: 1px;
  background-color: var(--tab-inactive-background);
  flex-shrink: 0;
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

.router-view-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

* {
  box-sizing: border-box;
}

@media (max-width: 640px) {
  .navigation-tabs {
    padding: 0.5rem 0.5rem 0;
  }

  .tab-link {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}
</style>