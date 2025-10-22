import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/MainLayout.vue'
import Home from '@/views/Home.vue'
import EntityList from '@/views/EntityList.vue'
import EntityDetail from '@/views/EntityDetail.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'entity-list', name: 'EntityList', component: EntityList },
      { path: 'entity-detail', name: 'EntityDetail', component: EntityDetail },
    ],
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
