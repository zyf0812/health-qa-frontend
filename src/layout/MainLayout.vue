<template>
  <el-container class="app-layout" direction="vertical">
    <!-- 顶部 Header（添加退出登录按钮） -->
    <el-header class="app-header">
      <div class="header-left">
        <span class="title">健康知识系统</span>
      </div>
      <!-- 退出登录按钮 -->
      <div class="header-right">
        <el-button 
          type="text" 
          class="logout-btn" 
          @click="handleLogout"
        >
          <i class="el-icon-switch-button"></i> 退出登录
        </el-button>
      </div>
    </el-header>

    <el-container class="main-container">
      <!-- 左侧导航栏 -->
      <el-aside class="app-aside" width="180px">
        <div class="sidebar-logo">
          <i class="el-icon-medkit"></i>
          <span>知识中心</span>
        </div>
        <el-menu
          mode="vertical"
          :default-active="activeMenu"
          background-color="#059669" 
          text-color="#e6f7f0"        
          active-text-color="#ffffff"
          class="side-menu"
          router
        >
          <!-- 导航项1 -->
          <el-menu-item index="/" class="menu-item">
            <i class="el-icon-question menu-icon"></i>
            <span slot="title" class="menu-text">健康养生知识问答</span>
          </el-menu-item>
          
          <!-- 导航项2 -->
          <el-menu-item index="/entity-list" class="menu-item">
            <i class="el-icon-list menu-icon"></i>
            <span slot="title" class="menu-text">查看健康实体列表</span>
          </el-menu-item>
          
          <!-- 导航项3 -->
          <el-menu-item index="/about" class="menu-item">
            <i class="el-icon-info menu-icon"></i>
            <span slot="title" class="menu-text">关于本站</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主体内容 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>

    <!-- 底部 -->
    <el-footer class="app-footer">
      © 2025 健康知识图谱系统 | Health Knowledge Graph
    </el-footer>
  </el-container>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus' // 导入弹窗组件

const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => {
  return route.path || '/'
})

// 退出登录逻辑（带确认提示）
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '退出确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    // 清除登录状态
    localStorage.removeItem('loginuser') // 清除token
    sessionStorage.clear() // 清除所有会话存储
    
    ElMessage.success('退出登录成功！')
    
    // 跳转到登录页
    router.push('/login')
  }).catch(() => {
    // 取消退出
    ElMessage.info('已取消退出登录')
  })
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
  background-color: #f8fafc;
}

/* 顶部导航栏 */
.app-header {
  height: 64px;
  background: linear-gradient(90deg, #1eaf3b, #54f63b);
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 标题居左，退出按钮居右 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

/* 标题左侧容器 */
.header-left .title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 1px;
}

/* 退出登录按钮样式 */
.header-right {
  display: flex;
  align-items: center;
}

.logout-btn {
  font-size: 15px;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* 主内容容器 */
.main-container {
  flex: 1;
  display: flex;
  height: calc(100vh - 64px - 40px);
}

/* 左侧导航栏 */
.app-aside {
  background-color: #059669;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 侧边栏Logo */
.sidebar-logo {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.sidebar-logo i {
  font-size: 20px;
  margin-right: 10px;
}

/* 菜单容器 */
.side-menu {
  border-right: none;
  height: calc(100% - 60px);
  padding-top: 10px;
}

/* 菜单项基础样式 */
.menu-item {
  height: 52px;
  line-height: 52px;
  margin: 0 8px;
  border-radius: 6px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

/* 菜单项图标 */
.menu-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  margin-right: 12px;
  transition: all 0.25s ease;
}

/* 菜单项文字 */
.menu-text {
  font-size: 14px;
  transition: all 0.25s ease;
}

/* 菜单项悬停效果 */
.menu-item:not(.is-active):hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.menu-item:not(.is-active):hover .menu-icon {
  color: #fff;
}

.menu-item:not(.is-active):hover .menu-text {
  color: #fff;
}

/* 菜单项激活状态 */
.menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #fff;
}

/* 主体内容区 */
.app-main {
  flex: 1;
  padding: 24px 48px;
  overflow-y: auto;
  background-color: #f9fafb;
}

/* 页脚 */
.app-footer {
  height: 40px !important;
  padding: 0;
  line-height: 40px;
  text-align: center;
  color: #999;
  font-size: 13px;
  border-top: 1px solid #e5e7eb;
  background-color: #fff;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    height: auto;
  }
  
  .app-aside {
    width: 100% !important;
    height: auto;
  }
  
  .sidebar-logo {
    display: none;
  }
  
  .side-menu {
    display: flex;
    flex-direction: row;
    padding-top: 0;
    height: auto;
  }
  
  .menu-item {
    flex: 1;
    padding: 0;
    text-align: center;
    margin: 0;
    border-radius: 0;
    height: 50px;
    line-height: 50px;
  }
  
  .menu-item.is-active::before {
    width: 100%;
    height: 4px;
    top: 0;
    left: 0;
  }
  
  .menu-icon {
    margin-right: 6px;
    font-size: 16px;
  }
}
</style>