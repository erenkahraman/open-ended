import { createRouter, createWebHistory } from 'vue-router';
import TeacherView from '../views/TeacherView.vue';
import StudentView from '../views/StudentView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes = [
  {
    path: '/',
    redirect: '/teacher'
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: TeacherView,
    meta: {
      title: 'Teacher Dashboard',
      requiresAuth: false
    }
  },
  {
    path: '/student',
    name: 'student',
    component: StudentView,
    meta: {
      title: 'Student Dashboard',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: 'Page Not Found'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Semantic Checker'} - Semantic Evaluation System`;
  next();
});

export default router;