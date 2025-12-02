<template>
  <div class="findback-reset-container">
    <!-- 背景装饰层（与验证页一致） -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
    </div>

    <el-card class="findback-card" shadow="hover">
      <div class="findback-header">
        <h2 class="findback-title">重置密码</h2>
        <p class="findback-desc">设置新密码后，请使用新密码登录账号</p>
      </div>

      <el-form 
        :model="resetForm" 
        :rules="resetRules" 
        ref="resetFormRef" 
        label-width="80px" 
        class="findback-form"
        :disabled="isResetting"
      >
        <!-- 用户名（从URL获取，不可修改） -->
        <el-form-item label="用户名" prop="userName">
          <el-input 
            v-model="resetForm.userName" 
            disabled
            prefix-icon="el-icon-user"
            class="custom-input"
            placeholder="加载中..."
          ></el-input>
        </el-form-item>

        <!-- 新密码 -->
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="resetForm.newPassword" 
            type="password" 
            prefix-icon="el-icon-lock"
            show-password
            class="custom-input"
            placeholder="6-20位，需包含字母和数字"
            @input="handlePasswordInput"
          ></el-input>
          <!-- 密码强度提示（实时更新） -->
          <div class="password-strength" v-if="resetForm.newPassword.length > 0">
            <div class="strength-bar">
              <div 
                class="strength-progress" 
                :style="{ width: getStrengthProgressWidth(), background: getStrengthColor() }"
              ></div>
            </div>
            <div class="strength-text">
              <i :class="getStrengthIcon()"></i>
              <span :class="getStrengthTextClass()">{{ getStrengthDesc() }}</span>
            </div>
          </div>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="resetForm.confirmPassword" 
            type="password" 
            prefix-icon="el-icon-lock"
            show-password
            class="custom-input"
            placeholder="请再次输入新密码"
          ></el-input>
          <!-- 密码匹配提示 -->
          <div class="password-match" v-if="resetForm.confirmPassword.length > 0">
            <i 
              :class="resetForm.newPassword === resetForm.confirmPassword 
                ? 'el-icon-check text-green-500' 
                : 'el-icon-close text-red-500'"
            ></i>
            <span 
              :class="resetForm.newPassword === resetForm.confirmPassword 
                ? 'text-green-500' 
                : 'text-red-500'"
            >
              {{ resetForm.newPassword === resetForm.confirmPassword 
                ? '密码匹配成功' 
                : '两次输入的密码不一致' }}
            </span>
          </div>
        </el-form-item>

        <!-- 操作按钮组 -->
        <el-form-item>
          <el-button 
            type="primary" 
            class="check-btn" 
            size="large"
            @click="handleReset"
            :loading="isResetting"
          >
            <i class="el-icon-refresh-right"></i> 确认重置
          </el-button>
          <el-button 
            type="text" 
            class="go-login-btn"
            @click="goBack"
            :disabled="isResetting"
          >
            <i class="el-icon-arrow-left"></i> 返回上一步
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const resetFormRef = ref(null)
const isResetting = ref(false)

// 表单数据
const resetForm = reactive({
  userName: '',       // 从URL参数获取
  newPassword: '',    // 新密码
  confirmPassword: '' // 确认密码
})

// 表单校验规则（强化校验）
const resetRules = reactive({
  userName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度需在 6-20 位之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码需同时包含字母和数字', trigger: 'blur' },
    { pattern: /^[^\\\s'"]+$/, message: '密码不能包含空格、单引号、双引号或反斜杠', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== resetForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: ['blur', 'input']
    }
  ]
})

// 页面加载时获取用户名
onMounted(() => {
  const userName = route.query.userName
  if (userName) {
    resetForm.userName = userName.trim()
  } else {
    ElMessage.warning('身份验证失效，请重新验证')
    router.push('/findback-check')
  }
})

// 监听密码输入，实时更新强度（空函数用于触发响应式）
const handlePasswordInput = () => {}

// 获取密码强度（0-3级）
const getPasswordStrength = () => {
  const pwd = resetForm.newPassword
  if (pwd.length < 6) return 0
  let strength = 1
  // 包含字母+数字（基础强度）
  if (/^(?=.*[a-zA-Z])(?=.*\d)/.test(pwd)) strength = 2
  // 包含特殊符号（高强度）
  if (/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/.test(pwd)) strength = 3
  // 长度≥12位（强化强度）
  if (pwd.length >= 12) strength = Math.min(strength + 1, 3)
  return strength
}

// 密码强度进度条宽度
const getStrengthProgressWidth = () => {
  const strength = getPasswordStrength()
  return `${(strength / 3) * 100}%`
}

// 密码强度颜色
const getStrengthColor = () => {
  const strength = getPasswordStrength()
  switch (strength) {
    case 0: return '#e5e7eb'
    case 1: return '#ef4444'
    case 2: return '#f97316'
    case 3: return '#10b981'
    default: return '#e5e7eb'
  }
}

// 密码强度图标
const getStrengthIcon = () => {
  const strength = getPasswordStrength()
  switch (strength) {
    case 0: return 'el-icon-warning text-gray-400'
    case 1: return 'el-icon-warning text-red-500'
    case 2: return 'el-icon-exclamation-circle text-orange-500'
    case 3: return 'el-icon-check-circle text-green-500'
    default: return 'el-icon-warning text-gray-400'
  }
}

// 密码强度描述
const getStrengthDesc = () => {
  const strength = getPasswordStrength()
  switch (strength) {
    case 0: return '密码长度不足6位'
    case 1: return '弱密码（建议增加长度或包含特殊符号）'
    case 2: return '中强度密码（包含字母和数字）'
    case 3: return '高强度密码（包含字母、数字和特殊符号）'
    default: return '请输入密码'
  }
}

// 密码强度文本样式
const getStrengthTextClass = () => {
  const strength = getPasswordStrength()
  switch (strength) {
    case 0: return 'text-gray-400'
    case 1: return 'text-red-500'
    case 2: return 'text-orange-500'
    case 3: return 'text-green-500'
    default: return 'text-gray-400'
  }
}

// 返回上一步
const goBack = () => {
  router.go(-1)
}

// 提交重置密码
const handleReset = async () => {
  // 前端表单校验
  const valid = await resetFormRef.value.validate().catch(() => false)
  if (!valid) return

  // 二次确认
  try {
    await ElMessageBox.confirm(
      '确认重置密码？重置后原密码将失效，请使用新密码登录',
      '重要提示',
      {
        confirmButtonText: '确认重置',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
  } catch (e) {
    ElMessage.info('已取消重置')
    return
  }

  isResetting.value = true
  try {
    // 构造请求参数
    const params = new URLSearchParams()
    params.append('userName', resetForm.userName)
    params.append('password', resetForm.newPassword)

    // 调用后端接口
    const data = await request.put('/find', params)

    // 适配后端返回格式：{"code":200,"msg":"操作成功","data":...}
    if (data === true) {
      ElMessage.success('重置成功，请使用新密码登录')
      // 跳转登录页
       setTimeout(() => {
      router.push('/login')
    }, 1500)
    }
  } catch (error) {
    ElMessage.error('重置失败：' + (error.message || '服务器异常'))
  } finally {
    isResetting.value = false
  }
}
</script>

<style scoped>
.findback-reset-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 100%);
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  padding: 20px;
}

/* 背景装饰 */
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
  opacity: 0.5;
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  top: 20%;
  right: 15%;
}

.bg-circle-2 {
  width: 500px;
  height: 500px;
  bottom: 10%;
  left: 10%;
}

.findback-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  padding: 50px 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 40px rgba(64, 158, 255, 0.12);
  backdrop-filter: blur(8px);
}

.findback-header {
  text-align: center;
  margin-bottom: 40px;
}

.findback-title {
  font-size: 26px;
  color: #165dff;
  font-weight: 700;
  margin-bottom: 8px;
}

.findback-desc {
  font-size: 14px;
  color: #64748b;
}

.findback-form {
  margin-top: 10px;
}

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

/* 密码强度样式 */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-progress {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

/* 密码匹配提示 */
.password-match {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

/* 按钮样式（与验证页完全一致） */
.check-btn {
  width: 70%;
  height: 54px;
  font-size: 18px;
  background: linear-gradient(90deg, #409eff, #165dff);
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.25);
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.check-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.35);
}

.go-login-btn {
  color: #64748b;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.go-login-btn:hover {
  color: #409eff;
  text-decoration: underline;
}

.el-form-item {
  margin-bottom: 22px;
}

/* 适配Element Plus加载图标 */
:deep(.el-button--loading .el-icon-loading) {
  margin-right: 8px;
}
</style>