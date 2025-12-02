import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/MainLayout.vue'
import Home from '@/views/Home.vue'
import EntityList from '@/views/EntityList.vue'
import EntityDetail from '@/views/EntityDetail.vue'
import AboutView from '@/views/AboutView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import CheckUserInfo from '@/views/CheckUserInfo.vue'
import UpdateUserInfo from '@/views/UpdateUserInfo.vue'
import FindBackCheck from '@/views/FindBackCheck.vue'
import FindBackReset from '@/views/FindBackReset.vue'

// 路由配置：仅定义路径和组件，无需 requiresAuth 权限标记（前端不校验）
const routes = [
  // 公开页面
  {path: '/login',name: 'Login',component: Login,meta: { title: '用户登录' } },
  {path: '/register',name: 'Register',component: Register,meta: { title: '用户注册' }},
  {path: '/check-user-info',name: 'CheckUserInfo',component: CheckUserInfo,meta: { title: '查询用户信息' }},
  {path: '/update-user-info',name: 'UpdateUserInfo',component: UpdateUserInfo,meta: { title: '用户信息' }},
  {path: '/findback-check',name: 'FindBackCheck',component: FindBackCheck,meta: { title: '找回密码-身份验证' }},
  {path: '/findback-reset',name: 'FindBackReset',component: FindBackReset,meta: { title: '找回密码-重置密码' }},

  // 所有页面
  {path: '/',component: AppLayout,children: [
      {path: '',name: 'Home',component: Home,meta: { title: '健康养生知识问答' }},
      {path: 'entity-list',name: 'EntityList',component: EntityList,meta: { title: '实体列表' }},
      {path: 'entity-detail',name: 'EntityDetail',component: EntityDetail,meta: { title: '实体详情' }},
      {path: 'about',name: 'About',component: AboutView,meta: { title: '关于我们' }},
    ]
  },

  // 404 页面
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory('/'),
  routes
})

// 全局路由守卫
router.beforeEach((to, _, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router