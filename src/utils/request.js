import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'  // 导入路由实例

// 创建Axios实例
const request = axios.create({
  baseURL: 'http://localhost:8999',
  timeout: 30000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
   const token = JSON.parse(localStorage.getItem('loginuser') || '{}')?.token;
  // 有 token 才添加到请求头
  if (token) {
    config.headers.token = token;
  }
  return config
  },
  error => {
    ElMessage.error('请求发送失败：' + error.message)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return res.data
    } else {
      return Promise.reject(new Error(res.msg || '操作失败'))
    }
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('loginuser')
      router.push('/login')
    }
    else {
      ElMessage.error('网络错误：' + error.message)
    }
    return Promise.reject(error)
  }
)

export default request