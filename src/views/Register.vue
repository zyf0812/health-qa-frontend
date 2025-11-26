<template>
  <div class="register-page">
    <!-- 背景装饰层（与登录页风格统一） -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>

    <!-- 注册卡片容器 -->
    <div class="register-container">
      <el-card class="register-card" shadow="hover">
        <!-- 标题区域优化 -->
        <div class="register-header">
          <h2 class="register-title">健康养生知识问答平台</h2>
          <p class="register-subtitle">创建您的账号，开启健康养生之旅</p>
        </div>
        
        <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="80px" class="register-form">
          <!-- 用户名输入框 -->
          <el-form-item label="用户名" prop="userName">
            <el-input 
              v-model="registerForm.userName" 
              placeholder="请输入用户名（3-20位，支持字母、数字、下划线、短横线）" 
              clearable
              prefix-icon="el-icon-user"
              @input="handleUserNameInput"
              class="custom-input"
            ></el-input>
          </el-form-item>
          
          <!-- 密码输入框（带强度提示） -->
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="registerForm.password" 
              type="password" 
              placeholder="请输入密码（6-20位，含字母+数字）" 
              clearable
              prefix-icon="el-icon-lock"
              show-password
              class="custom-input"
            ></el-input>
            <!-- 密码强度提示（优化样式） -->
            <div class="password-strength" v-if="registerForm.password.length >= 6">
              <span :class="getPwdStrengthClass()">
                <i :class="getPwdStrengthIcon()"></i> {{ getPwdStrengthText() }}
              </span>
            </div>
          </el-form-item>
          
          <!-- 手机号输入框 -->
          <el-form-item label="手机号" prop="phone">
            <el-input 
              v-model="registerForm.phone" 
              placeholder="请输入11位手机号" 
              clearable
              prefix-icon="el-icon-phone"
              maxlength="11"
              @input="handlePhoneInput"
              class="custom-input"
            ></el-input>
          </el-form-item>
          
          <!-- 身份证号输入框 -->
          <el-form-item label="身份证号" prop="characterId">
            <el-input 
              v-model="registerForm.characterId" 
              placeholder="请输入18位身份证号（最后一位可输X）" 
              clearable
              prefix-icon="el-icon-id-card" 
              maxlength="18"
              @input="handleIdCardInput"
              class="custom-input"
            ></el-input>
          </el-form-item>
          
          <el-form-item class="btn-group">
            <el-button 
              type="primary" 
              class="register-btn" 
              size="large"
              @click="handleRegister"
              :loading="isLoading"
            >
              注册
            </el-button>
            <el-button 
              type="text" 
              class="go-login-btn"
              @click="goToLogin"
            >
              <i class="el-icon-login"></i> 已有账号？返回登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()
const registerFormRef = ref(null)
const isLoading = ref(false)

// 注册表单数据
const registerForm = reactive({
  userName: '',    // 用户名
  password: '',    // 密码
  phone: '',       // 手机号
  characterId: ''  // 身份证号
})

// 表单校验规则
const registerRules = reactive({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3-20 个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '用户名仅支持字母、数字、下划线和短横线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6-20 个字符之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: '密码需同时包含字母和数字', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  characterId: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { min: 18, max: 18, message: '身份证号长度必须为 18 位', trigger: 'blur' },
    { 
      pattern: /(^\d{17}(\d|X|x)$)/, 
      message: '请输入正确的身份证号（前17位为数字，最后一位可为数字或X/x）', 
      trigger: 'blur' 
    }
  ]
})

// 跳转到登录页
const goToLogin = () => router.push('/login')

// 用户名输入处理
const handleUserNameInput = () => {
  if (registerForm.userName) {
    registerForm.userName = registerForm.userName.replace(/[^a-zA-Z0-9_-]/g, '')
  }
}

// 手机号输入处理
const handlePhoneInput = () => {
  if (registerForm.phone) {
    registerForm.phone = registerForm.phone.replace(/[^0-9]/g, '')
  }
}

// 身份证号输入处理
const handleIdCardInput = () => {
  if (registerForm.characterId) {
    registerForm.characterId = registerForm.characterId
      .toUpperCase()
      .replace(/[^0-9X]/g, '')
  }
}

// 密码强度文本判断
const getPwdStrengthText = () => {
  const pwd = registerForm.password
  if (/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/.test(pwd)) {
    return '强（含字母、数字、特殊符号，安全性高）'
  } else if (/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(pwd) && pwd.length >= 12) {
    return '中（含字母+数字，长度充足）'
  } else {
    return '弱（仅含字母+数字，建议增加长度或特殊符号）'
  }
}

// 密码强度样式类（保持不变）
const getPwdStrengthClass = () => {
  const pwd = registerForm.password
  if (/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/.test(pwd)) {
    return 'text-green-500'
  } else if (/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(pwd) && pwd.length >= 12) {
    return 'text-orange-500'
  } else {
    return 'text-red-500'
  }
}

// 密码强度图标
const getPwdStrengthIcon = () => {
  const pwd = registerForm.password
  if (/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/.test(pwd)) {
    return 'el-icon-check-circle'
  } else if (/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(pwd) && pwd.length >= 12) {
    return 'el-icon-exclamation-circle'
  } else {
    return 'el-icon-warning'
  }
}

// 处理注册逻辑
const handleRegister = async () => {
  const valid = await registerFormRef.value.validate().catch(() => false)
  if (!valid) return

  isLoading.value = true
  try {
    const submitForm = {
      userName: registerForm.userName.trim(),
      password: registerForm.password.trim(),
      phone: registerForm.phone.trim(),
      characterId: registerForm.characterId.trim()
    }

    const params = new URLSearchParams()
    params.append('userName', submitForm.userName)
    params.append('password', submitForm.password)
    params.append('phone', submitForm.phone)
    params.append('characterId', submitForm.characterId)

    await request.get('/api/register/register', { params })

    ElMessage.success('注册成功！即将跳转到登录页')
    registerFormRef.value.resetFields()
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error) {
    console.error('注册失败：', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 页面根容器 - 与登录页一致的渐变背景 */
.register-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 50%, #f5fafe 100%);
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

/* 背景装饰元素 - 与登录页风格统一 */
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
  width: 450px;
  height: 450px;
  top: 15%;
  right: 10%;
  animation-delay: 0s;
}

.bg-circle-2 {
  width: 550px;
  height: 550px;
  bottom: 10%;
  left: 15%;
  animation-delay: 5s;
}

.bg-circle-3 {
  width: 350px;
  height: 350px;
  top: 65%;
  right: 25%;
  animation-delay: 10s;
}

/* 浮动动画 - 与登录页一致 */
@keyframes float {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(-30px, 30px) scale(1.05);
  }
}

/* 注册容器 - 居中+响应式 */
.register-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
}

/* 注册卡片 - 优化阴影和圆角（与登录页统一） */
.register-card {
  width: 100%;
  max-width: 480px;
  padding: 50px 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 40px rgba(64, 158, 255, 0.12);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* 卡片hover效果 */
.register-card:hover {
  box-shadow: 0 16px 48px rgba(64, 158, 255, 0.18);
  transform: translateY(-2px);
}

/* 标题区域 - 优化样式和间距 */
.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-title {
  font-size: 28px;
  font-weight: 700;
  color: #165dff;
  margin-bottom: 8px;
  letter-spacing: 1.2px;
}

.register-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* 表单样式优化 */
.register-form {
  margin-top: 10px;
}

/* 自定义输入框 - 与登录页一致的样式 */
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

/* 密码强度提示 - 优化样式 */
.password-strength {
  font-size: 13px;
  margin-top: 6px;
  height: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.password-strength i {
  font-size: 14px;
}

.text-green-500 { color: #10b981; }
.text-orange-500 { color: #f97316; }
.text-red-500 { color: #ef4444; }

/* 按钮组 - 优化布局和样式 */
.btn-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

/* 注册按钮 - 优化样式 */
.register-btn {
  width: 70%;
  height: 54px;
  font-size: 18px;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #409eff, #165dff);
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.25);
  transition: all 0.3s ease;
}

.register-btn:hover {
  background: linear-gradient(90deg, #36a3f7, #0f4cd0);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.35);
}

.register-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

/* 跳转登录按钮 - 优化样式 */
.go-login-btn {
  color: #409eff;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease;
}

.go-login-btn:hover {
  color: #165dff;
  text-decoration: underline;
}

/* 表单项间距优化 */
.el-form-item {
  margin-bottom: 22px;
}

/* 适配Element Plus输入框聚焦样式 */
::v-deep .el-input__wrapper:focus-within {
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}
 
</style>