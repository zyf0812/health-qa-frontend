<template>
  <div class="check-user-container">
    <el-card class="check-card" shadow="hover">
      <div class="check-header">
        <h2 class="check-title">身份验证</h2>
        <p class="check-desc">请输入完整信息进行身份验证，验证通过后可修改信息</p>
      </div>

      <el-form :model="checkForm" :rules="checkRules" ref="checkFormRef" label-width="80px" class="check-form">
        <el-form-item label="用户名" prop="userName">
          <el-input 
            v-model="checkForm.userName" 
            placeholder="请输入您的用户名" 
            clearable
            prefix-icon="el-icon-user"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="checkForm.password" 
            type="password" 
            placeholder="请输入您的密码" 
            clearable
            prefix-icon="el-icon-lock"
            show-password
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="checkForm.phone" 
            placeholder="请输入您的手机号" 
            clearable
            prefix-icon="el-icon-phone"
            maxlength="11"
            @input="handlePhoneInput"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="身份证号" prop="characterId">
          <el-input 
            v-model="checkForm.characterId" 
            placeholder="请输入您的身份证号" 
            clearable
            prefix-icon="el-icon-id-card"
            maxlength="18"
            @input="handleIdCardInput"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            class="check-btn" 
            size="large"
            @click="handleCheck"
            :loading="isChecking"
          >
            验证身份
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()
const checkFormRef = ref(null)
const isChecking = ref(false)

// 验证表单数据（新增密码和手机号）
const checkForm = reactive({
  userName: '',
  password: '',
  phone: '',
  characterId: ''
})

// 校验规则（新增密码和手机号规则）
const checkRules = reactive({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3-20 个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '用户名仅支持字母、数字、下划线和短横线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6-20 个字符之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: '密码需包含字母和数字', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  characterId: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { min: 18, max: 18, message: '身份证号长度必须为 18 位', trigger: 'blur' },
    { pattern: /(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号格式', trigger: 'blur' }
  ]
})

// 手机号输入处理（仅保留数字）
const handlePhoneInput = () => {
  if (checkForm.phone) {
    checkForm.phone = checkForm.phone.replace(/[^0-9]/g, '')
  }
}

// 身份证号输入处理（转大写+过滤非法字符）
const handleIdCardInput = () => {
  if (checkForm.characterId) {
    checkForm.characterId = checkForm.characterId
      .toUpperCase()
      .replace(/[^0-9X]/g, '')
  }
}

// 身份验证逻辑（传递四个参数）
const handleCheck = async () => {
  const valid = await checkFormRef.value.validate().catch(() => false)
  if (!valid) return

  isChecking.value = true
  try {
    // 构造请求参数（包含用户名、密码、手机号、身份证号）
    const params = new URLSearchParams()
    params.append('userName', checkForm.userName.trim())
    params.append('password', checkForm.password.trim())
    params.append('phone', checkForm.phone.trim())
    params.append('characterId', checkForm.characterId.trim())

    // 调用后端检查接口
    const data = await request.get('/api/update', { params })
    
    if (data) {
      // 验证通过，跳转至信息修改页（携带用户名参数）
      ElMessage.success('身份验证成功，即将进入信息修改页')
      router.push({ 
        path: '/update-user-info', 
        query: { userName: checkForm.userName } 
      })
    } 
  } catch (error) {
    ElMessage.error('验证失败：' + (error.message || '服务器异常'))
  } finally {
    isChecking.value = false
  }
}
</script>

<style scoped>
.check-user-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 100%);
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  padding: 20px;
}

.check-card {
  width: 100%;
  max-width: 480px;
  padding: 50px 40px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 12px 40px rgba(64, 158, 255, 0.12);
  backdrop-filter: blur(8px);
}

.check-header {
  text-align: center;
  margin-bottom: 40px;
}

.check-title {
  font-size: 26px;
  color: #165dff;
  font-weight: 700;
  margin-bottom: 8px;
}

.check-desc {
  font-size: 14px;
  color: #64748b;
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

.check-btn {
  width: 100%;
  height: 54px;
  font-size: 18px;
  background: linear-gradient(90deg, #409eff, #165dff);
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.25);
}

.check-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.35);
}

.el-form-item {
  margin-bottom: 22px;
}

/* 适配Element Plus密码输入框样式 */
::deep .el-input__inner[type="password"] {
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
}
</style>