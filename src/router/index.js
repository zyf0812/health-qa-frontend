 import { createRouter, createWebHistory } from 'vue-router'
     import Home from '../views/Home.vue'
     // 引入列表页（尚未创建，先配置）
     import EntityList from '../views/EntityList.vue'

     const routes = [
       { path: '/', name: 'Home', component: Home },  // 首页（问答页）
       { path: '/entity-list', name: 'EntityList', component: EntityList }  // 实体列表页
     ]

     const router = createRouter({
       history: createWebHistory(process.env.BASE_URL),
       routes
     })

     export default router
