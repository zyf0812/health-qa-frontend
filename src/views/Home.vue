 <template>
       <div class="home-container">
         <h1>{{ title }}</h1>

          <el-link
           to="/entity-list"
           class="list-link"
           >查看健康实体列表</el-link>

         <!-- 输入框：双向绑定question变量 -->
         <el-input 
           v-model="question" 
           placeholder="请输入健康问题" 
           class="input"
         ></el-input>
         <!-- 按钮：点击触发queryAnswer方法 -->
         <el-button @click="queryAnswer" type="primary" class="btn">查询答案</el-button>
         <!-- 答案显示：条件渲染（有答案时显示） -->
         <el-card v-if="answer" class="answer-card">
           <p>{{ answer }}</p>
         </el-card>
       </div>
     </template>

     <script setup>
     // Vue3组合式API：setup语法糖（简化代码）
     import { ref } from 'vue'  // ref用于创建响应式变量

     // 响应式变量（修改后页面自动更新）
     const title = ref("健康养生知识问答")
     const question = ref("")
     const answer = ref("")

     // 点击事件方法
      import request from '../utils/request'  // 引入封装的Axios

   const queryAnswer = async () => {  // async：异步方法
     if (!question.value.trim()) {
       ElMessage.warning("请输入你的健康问题！")
       return
     }
     try {
       // 发送POST请求，参数用URLSearchParams（表单格式）
       const params = new URLSearchParams()
       params.append('question', question.value)
       // 调用后端接口，await：等待请求完成
       const res = await request.post('/api/qa/query', params)
       // 赋值给answer（响应拦截器已处理，res直接是data部分）
       answer.value = res
     } catch (error) {
       // 捕获异常（如网络错误）
       answer.value = ""
     }
   }

     </script>

     <style scoped>
     /* scoped：样式只作用于当前组件 */
     .home-container { width: 800px; margin: 50px auto; }
     .input { margin-bottom: 15px; }
     .answer-card { margin-top: 20px; }
     </style>
