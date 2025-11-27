<template>
  <div class="update-user-container">
    <el-card class="update-card" shadow="hover">
      <div class="update-header">
        <h2 class="update-title">修改用户信息</h2>
        <p class="update-desc">请填写需要修改的信息，未填写项保持原有内容</p>
      </div>

      <el-form :model="updateForm" :rules="updateRules" ref="updateFormRef" label-width="80px" class="update-form">
        <el-form-item label="用户名" prop="userName">
          <el-input 
            v-model="updateForm.userName" 
            disabled
            placeholder="用户名不可修改" 
            prefix-icon="el-icon-user"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="新手机号" prop="phone">
          <el-input 
            v-model="updateForm.phone" 
            placeholder="请输入新手机号（选填）" 
            clearable
            prefix-icon="el-icon-phone"
            maxlength="11"
            @input="handlePhoneInput"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="password">
          <el-input 
            v-model="updateForm.password" 
            type="password" 
            placeholder="请输入新密码（选填，6-20位）" 
            clearable
            prefix-icon="el-icon-lock"
            show-password
            class="custom-input"
            @input="handlePasswordInput" 
          ></el-input>
          <!-- 新增：密码强度提示（与重置密码页一致） -->
          <div class="password-strength" v-if="updateForm.password.length > 0">
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

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="updateForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入新密码" 
            clearable
            prefix-icon="el-icon-lock"
            show-password
            class="custom-input"
          ></el-input>
          <!-- 密码匹配提示 -->
          <div class="password-match" v-if="updateForm.confirmPassword.length > 0">
            <i 
              :class="updateForm.password === updateForm.confirmPassword 
                ? 'el-icon-check text-green-500' 
                : 'el-icon-close text-red-500'"
            ></i>
            <span 
              :class="updateForm.password === updateForm.confirmPassword 
                ? 'text-green-500' 
                : 'text-red-500'"
            >
              {{ updateForm.password === updateForm.confirmPassword 
                ? '密码匹配成功' 
                : '两次输入的密码不一致' }}
            </span>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            class="update-btn" 
            size="large"
            @click="handleUpdate"
            :loading="isUpdating"
          >
            提交修改
          </el-button>
          <el-button 
            type="text" 
            class="back-btn"
            @click="goBack"
          >
            返回
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
const updateFormRef = ref(null)
const isUpdating = ref(false)

// 修改表单数据
const updateForm = reactive({
  userName: '',       // 从URL参数获取，不可修改
  phone: '',          // 新手机号
  password: '',       // 新密码
  confirmPassword: '' // 确认密码
})

// 校验规则
const updateRules = reactive({
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { min: 6, max: 20, message: '密码长度在 6-20 个字符之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: '密码需包含字母和数字', trigger: 'blur' },
    { pattern: /^[^\\\s'"]+$/, message: '密码不能包含空格、单引号、双引号或反斜杠', trigger: 'blur' } // 新增：特殊字符限制
  ],
  confirmPassword: [
    { 
      validator: (rule, value, callback) => {
        if (value && value !== updateForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: ['blur', 'input'] // 优化：input时也触发校验
    }
  ]
})

// 页面加载时获取URL中的用户名
onMounted(() => {
  const userName = route.query.userName
  if (userName) {
    updateForm.userName = userName
  } else {
    ElMessage.warning('身份验证失效，请重新验证')
    router.push('/check-user-info')
  }
})

// 手机号输入处理（仅保留数字）
const handlePhoneInput = () => {
  if (updateForm.phone) {
    updateForm.phone = updateForm.phone.replace(/[^0-9]/g, '')
  }
}

// 监听密码输入，触发响应式更新
const handlePasswordInput = () => {}

// 获取密码强度
const getPasswordStrength = () => {
  const pwd = updateForm.password
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

// 新增：密码强度描述
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

// 新增：密码强度文本样式
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

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 提交修改逻辑
const handleUpdate = async () => {
  const valid = await updateFormRef.value.validate().catch(() => false)
  if (!valid) return

  // 确认修改
  try {
    await ElMessageBox.confirm(
      '确认提交修改吗？未填写的信息将保持原有内容',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch (e) {
    ElMessage.info('已取消修改')
    return
  }

  isUpdating.value = true
  try {
    // 构造修改参数（仅传递有值的字段，避免覆盖原有信息）
    const updateData = {
      userName: updateForm.userName,
      phone: updateForm.phone,
      password: updateForm.password,
    }

    // 调用后端更新接口（PUT请求）
    await request.put('/api/update', updateData)

    ElMessage.success('信息修改成功！')
    // 跳转登录页重新登录
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error) {
    console.error('修改信息异常：', error)
    ElMessage.error('修改失败：' + (error.message || '服务器异常'))
  } finally {
    isUpdating.value = false
  }
}
</script>

<style scoped>
.update-user-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8fb 0%, #e8f4f8 100%);
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  padding: 20px;
}

.update-card {
  width: 100%;
  max-width: 520px;
  padding: 50px 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 40px rgba(64, 158, 255, 0.12);
  backdrop-filter: blur(8px);
}

.update-header {
  text-align: center;
  margin-bottom: 40px;
}

.update-title {
  font-size: 26px;
  color: #165dff;
  font-weight: 700;
  margin-bottom: 8px;
}

.update-desc {
  font-size: 14px;
  color: #64748b;
}

.update-form {
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

/* 密码匹配提示样式 */
.password-match {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.update-btn {
  width: 70%;
  height: 54px;
  font-size: 18px;
  background: linear-gradient(90deg, #409eff, #165dff);
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.25);
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.update-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.35);
}

.back-btn {
  color: #64748b;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.back-btn:hover {
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