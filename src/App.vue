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
import './assets/styles/global.css';
import './assets/styles/navigation.css';
import './assets/styles/transitions.css';

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
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.router-view-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>