import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('@/views/docs.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard.vue'),
  },
  {
    path: '/guild/:id/settings',
    name: 'guild-settings',
    component: () => import('@/views/guild.vue'),
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/terms.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/privacy.vue'),
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/error.vue'),
  },

  {
    path: '/backup',
    name: 'backups',
    component: () => import('@/views/user-backups.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
