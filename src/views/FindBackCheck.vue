<template>
  <div class="findback-check-container">
    <el-card class="findback-card" shadow="hover">
      <div class="findback-header">
        <h2 class="findback-title">找回密码</h2>
        <p class="findback-desc">请输入以下信息完成身份验证</p>
      </div>

      <el-form :model="checkForm" :rules="checkRules" ref="checkFormRef" label-width="80px" class="findback-form">
        <el-form-item label="用户名" prop="userName">
          <el-input 
            v-model="checkForm.userName" 
            placeholder="请输入您的用户名" 
            clearable
            prefix-icon="el-icon-user"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="checkForm.phone" 
            type="tel"
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
          <el-button 
            type="text" 
            class="go-login-btn"
            @click="goToLogin"
          >
            返回登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()
const checkFormRef = ref(null)
const isChecking = ref(false)

const checkForm = reactive({
  userName: '',
  phone: '', 
  characterId: ''
})


const checkRules = reactive({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3-20 个字符之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '用户名仅支持字母、数字、下划线和短横线', trigger: 'blur' }
  ],
  phone: [ 
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '手机号长度必须为 11 位', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  characterId: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { min: 18, max: 18, message: '身份证号长度必须为 18 位', trigger: 'blur' },
    { pattern: /(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号格式', trigger: 'blur' }
  ]
})

// 身份证号输入处理（转大写+过滤非法字符）
const handleIdCardInput = () => {
  if (checkForm.characterId) {
    checkForm.characterId = checkForm.characterId
      .toUpperCase()
      .replace(/[^0-9X]/g, '')
  }
}

const handlePhoneInput = () => {
  if (checkForm.phone) {
    checkForm.phone = checkForm.phone.replace(/[^0-9]/g, '')  // 只保留数字
  }
}

// 返回登录页
const goToLogin = () => {
  router.push('/login')
}

// 身份验证逻辑
const handleCheck = async () => {
  const valid = await checkFormRef.value.validate().catch(() => false)
  if (!valid) return

  isChecking.value = true
  try {
    // 构造请求参数
    const params = new URLSearchParams()
    params.append('userName', checkForm.userName.trim())
    params.append('phone', checkForm.phone.trim())  
    params.append('characterId', checkForm.characterId.trim())

    // 调用后端检查接口（
      await request.get('/find', { params })

    // 适配后端返回格式：{"code":200,"msg":"操作成功","data":true}
      ElMessage.success('身份验证成功，即将进入密码重置页')
      // 携带用户名跳转至重置页
      router.push({ 
        path: '/findback-reset', 
        query: { userName: checkForm.userName } 
      })
  } catch (error) {
    ElMessage.error('验证失败：' + (error.message || '服务器异常'))
  } finally {
    isChecking.value = false
  }
}
</script>

<style scoped>
.findback-check-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 100%);
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  padding: 20px;
}

.findback-card {
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
  width: 70%;
  height: 54px;
  font-size: 18px;
  background: linear-gradient(90deg, #409eff, #165dff);
  border-radius: 12px;
  border: none;
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.25);
  margin-right: 15px;
}

.check-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.35);
}

.go-login-btn {
  color: #64748b;
  font-size: 16px;
}

.go-login-btn:hover {
  color: #409eff;
  text-decoration: underline;
}

.el-form-item {
  margin-bottom: 22px;
}
</style>