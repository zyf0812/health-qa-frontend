<template>
  <el-container class="app-layout">
    <!-- 顶部 Header -->
    <el-header class="app-header">
      <!-- 左侧导航栏 -->
      <div class="nav-left">
        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          background-color="transparent"
          text-color="#fff"
          active-text-color="#ffd04b"
          class="menu"
        >
          <el-menu-item index="home" @click="goTo('/')">首页</el-menu-item>
          <el-menu-item index="about" @click="goTo('/about')">关于</el-menu-item>
        </el-menu>
      </div>

      <!-- 中间标题 -->
      <div class="header-center">
        <span class="title">健康知识图谱系统</span>
      </div>
    </el-header>

    <!-- 主体内容 -->
    <el-main class="app-main">
      <router-view />
    </el-main>

    <!-- 底部 -->
    <el-footer class="app-footer">
      © 2025 健康知识图谱系统 | Health Knowledge Graph
    </el-footer>
  </el-container>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => {
  if (route.path.includes('entity-list')) return 'entity-list'
  if (route.path.includes('about')) return 'about'
  return 'home'
})

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafc;
}

/* 顶部导航栏 */
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(90deg, #1e40af, #3b82f6);
  height: 64px;
  padding: 0 40px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 左侧菜单 */
.nav-left {
  flex: 1;
}

/* 菜单样式 */
.menu {
  background: transparent;
  border: none;
}

/* 居中标题 */
.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.title {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #fff;
}

/* 主体内容 */
.app-main {
  flex: 1;
  padding: 24px 48px;
  overflow-y: auto;
  background-color: #f9fafb;
}

/* 页脚 */
.app-footer {
  text-align: center;
  padding: 12px 0;
  color: #999;
  font-size: 13px;
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
}
</style>
