import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from './pages/index/index.vue';
import TestPage from './pages/test/index.vue';
import ResultPage from './pages/result/index.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage,
    },
    {
      path: '/test/:gender',
      name: 'test',
      component: TestPage,
    },
    {
      path: '/result/:resultId',
      name: 'result',
      component: ResultPage,
    },
  ],
});
