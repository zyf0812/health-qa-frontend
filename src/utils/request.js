import axios from 'axios'
     import { ElMessage } from 'element-plus'  // Element Plus提示组件

     // 创建Axios实例
     const request = axios.create({
       baseURL: 'http://localhost:8080',  // 后端接口基础地址
       timeout: 30000,  // 请求超时时间（30秒）
       headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // 表单提交格式
     })

     // 请求拦截器
     request.interceptors.request.use(
       config => {
         // 后续如需登录，可在此添加Token
         return config
       },
       error => {
         ElMessage.error('请求发送失败：' + error.message)
         return Promise.reject(error)
       }
     )

     // 响应拦截器（统一处理后端返回的Result格式）
     request.interceptors.response.use(
       response => {
         const res = response.data
         // 成功：返回data部分
         if (res.code === 200) {
           return res.data
         } 
         // 失败：显示提示
         else {
           ElMessage.error(res.msg || '操作失败')
           return Promise.reject(new Error(res.msg || '操作失败'))
         }
       },
       error => {
         ElMessage.error('网络错误：' + error.message)
         return Promise.reject(error)
       }
     )

     export default request
