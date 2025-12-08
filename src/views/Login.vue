<template>
  <div class="login-page">
    <!-- 背景装饰层 -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>

    <!-- 登录卡片容器 -->
    <div class="login-container">
      <el-card class="login-card" shadow="hover">
        <!-- 登录标题区域 -->
        <div class="login-header">
          <h2 class="login-title">健康养生知识问答平台</h2>
          <p class="login-subtitle">请登录您的账号</p>
        </div>
        
        <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px" class="login-form">
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名" 
              clearable
              prefix-icon="el-icon-user"
              class="custom-input"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码" 
              clearable
              prefix-icon="el-icon-lock"
              show-password
              class="custom-input"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="验证码" prop="vcode">
            <div class="vcode-container">
              <el-input 
                v-model="loginForm.vcode" 
                placeholder="请输入右侧验证码" 
                clearable
                prefix-icon="el-icon-shield"
                class="vcode-input custom-input"
              ></el-input>
              <div 
                class="vcode-text"
                @click="getVcode"
                title="点击刷新验证码"
              >
                {{ currentVcode }}
              </div>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              class="login-btn" 
              size="large"
              @click="handleLogin"
              :loading="isLoading"
            >
              登录
            </el-button>
          </el-form-item>
          
          <!-- 优化后的功能按钮组 -->
          <div class="func-btn-group">
            <el-button 
              type="text" 
              class="func-btn findback-btn"
              @click="goToFindback"
            >
              <i class="el-icon-key"></i> 忘记密码
            </el-button>
            <el-button 
              type="text" 
              class="func-btn update-info-btn"
              @click="goToUpdateInfo"
            >
              <i class="el-icon-edit"></i> 修改账号信息
            </el-button>
            <el-button 
              type="text" 
              class="func-btn register-btn"
              @click="goToRegister"
            >
              <i class="el-icon-user-plus"></i> 注册新账号
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request' 
import { useRouter } from 'vue-router'

const router = useRouter()
const loginFormRef = ref(null)
const isLoading = ref(false)
const currentVcode = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  vcode: ''
})

const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3-20 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6-20 个字符之间', trigger: 'blur' }
  ],
  vcode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度为 6 个字符', trigger: 'blur' }
  ]
})

onMounted(() => {
  getVcode()
})

const getVcode = async () => {
  currentVcode.value = '加载中...'
  try {
    const data = await request.get('/log/vcode', {
      params: { timestamp: new Date().getTime() }
    })
    currentVcode.value = data
  } catch (error) {
    currentVcode.value = '获取失败'
    ElMessage.error('验证码获取失败，请重试')
  }
}

const handleLogin = async () => {
  const valid = await loginFormRef.value.validate().catch(() => false)
  if (!valid) return

  isLoading.value = true
  try {
    const params = new URLSearchParams()
    params.append('username', loginForm.username.trim())
    params.append('password', loginForm.password.trim())
    params.append('code', loginForm.vcode.trim())

    const data = await request.post('/log/login', params);
    localStorage.setItem('loginuser', JSON.stringify(data));  
    ElMessage.success('登录成功！')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message || '登录失败，请检查账号或验证码')
    getVcode()
    loginForm.vcode = ''
  } finally {
    isLoading.value = false
  }
}

// 跳转注册页
const goToRegister = () => {
  router.push('/register')
}

// 跳转信息修改验证页
const goToUpdateInfo = () => {
  router.push('/check-user-info')
}

// 跳转找回密码验证页
const goToFindback = () => {
  router.push('/findback-check')
}
</script>

<style scoped>
/* 页面根容器 - 全屏背景+弹性布局 */
.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 50%, #f5fafe 100%);
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

/* 背景装饰元素  */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(64, 158, 255, 0.05);
  filter: blur(40px);
  animation: float 15s infinite ease-in-out alternate;
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.bg-circle-2 {
  width: 500px;
  height: 500px;
  bottom: 10%;
  right: 15%;
  animation-delay: 5s;
}

.bg-circle-3 {
  width: 300px;
  height: 300px;
  top: 60%;
  left: 25%;
  animation-delay: 10s;
}

/* 浮动动画 */
@keyframes float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(30px, -30px) scale(1.05);
  }
}

/* 登录容器 - 居中+响应式 */
.login-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
}

/* 登录卡片 - 优化阴影和圆角 */
.login-card {
  width: 100%;
  max-width: 480px;
  padding: 50px 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 40px rgba(64, 158, 255, 0.12);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* 卡片hover效果增强 */
.login-card:hover {
  box-shadow: 0 16px 48px rgba(64, 158, 255, 0.18);
  transform: translateY(-2px);
}

/* 登录标题区域 - 优化间距和样式 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #165dff;
  margin-bottom: 8px;
  letter-spacing: 1.2px;
}

.login-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* 表单样式优化 */
.login-form {
  margin-top: 10px;
}

/* 自定义输入框 - 优化高度和边框 */
.custom-input {
  height: 50px;
  font-size: 16px;
  border-radius: 12px;
  border: 1px solid #e0efff;
  transition: all 0.2s ease;
}

.custom-input:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

/* 验证码容器 - 优化对齐 */
.vcode-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.vcode-input {
  flex: 1;
}

.vcode-text {
  width: 130px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f9ff;
  color: #165dff;
  border: 1px solid #e0efff;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.vcode-text:hover {
  background-color: #e0efff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

/* 登录按钮 - 优化渐变和阴影 */
.login-btn {
  width: 100%;
  height: 54px;
  font-size: 18px;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #409eff, #165dff);
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.25);
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(90deg, #36a3f7, #0f4cd0);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.35);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

/* 优化后的功能按钮组 - 均匀分布+统一样式 */
.func-btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 0 10px;
}

/* 统一功能按钮样式 */
.func-btn {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

/* 忘记密码按钮 - 中性色 */
.findback-btn {
  color: #64748b;
}

.findback-btn:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.08);
  text-decoration: none;
}

/* 修改账号信息按钮 - 主色 */
.update-info-btn {
  color: #409eff;
}

.update-info-btn:hover {
  color: #165dff;
  background-color: rgba(64, 158, 255, 0.08);
  text-decoration: none;
}

/* 注册新账号按钮 - 强调色 */
.register-btn {
  color: #165dff;
  font-weight: 500;
}

.register-btn:hover {
  color: #0f4cd0;
  background-color: rgba(64, 158, 255, 0.1);
  text-decoration: none;
}

/* 响应式适配 - 小屏幕自动换行 */
@media (max-width: 480px) {
  .func-btn-group {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }
  
  .func-btn {
    font-size: 13px;
  }
}
</style>