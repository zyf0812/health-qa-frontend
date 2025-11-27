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

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: '用户登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false,
      title: '用户注册'
    }
  },
  {
    path: '/check-user-info',
    name: 'CheckUserInfo',
    component: CheckUserInfo,
    meta: {
      requiresAuth: false,
      title: '查询用户信息'
    }
  },
  {
    path: '/update-user-info',
    name: 'UpdateUserInfo',
    component: UpdateUserInfo,
    meta: {
      requiresAuth: false,
      title: '用户信息'
    }
  },
  {
    path: '/findback-check',
    name: 'FindBackCheck',
    component: FindBackCheck,
    meta: {
      requiresAuth: false,
      title: '找回密码-身份验证'
    }
  },
  {
    path: '/findback-reset',
    name: 'FindBackReset',
    component: FindBackReset,
    meta: {
      requiresAuth: false,
      title: '找回密码-重置密码'
    }
  },
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
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 强制根路径跳转登录页（不改路径的核心逻辑）
  if (to.path === '/' && !localStorage.getItem('token')) {
    next('/login')
    return
  }
  
  next()
})

export default router