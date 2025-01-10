import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/styles/global.css';
import './assets/styles/components.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

router.isReady().then(() => {
  app.mount('#app');
});