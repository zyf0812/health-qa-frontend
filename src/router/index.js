import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/MainLayout.vue'
import Home from '@/views/Home.vue'
import EntityList from '@/views/EntityList.vue'
import EntityDetail from '@/views/EntityDetail.vue'
import AboutView from '@/views/AboutView.vue'
// 导入登录和注册组件（确保文件路径正确）
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

const routes = [
  // 登录页（独立路由，不使用 AppLayout 布局）
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false, // 不需要登录即可访问
      title: '用户登录' // 页面标题
    }
  },
  // 注册页（独立路由，不使用 AppLayout 布局）
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false, // 不需要登录即可访问
      title: '用户注册' // 页面标题
    }
  },
  // 主布局路由（包含首页、实体列表等需要布局的页面）
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'Home', component: Home, meta: { title: '健康养生知识问答' } },
      { path: 'entity-list', name: 'EntityList', component: EntityList, meta: { title: '实体列表' } },
      { path: 'entity-detail', name: 'EntityDetail', component: EntityDetail, meta: { title: '实体详情' } },
      { path: 'about', name: 'About', component: AboutView, meta: { title: '关于我们' } },
    ],
  },
  // 添加404页面路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/' // 未匹配到的路由跳转到首页
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

// 动态设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router