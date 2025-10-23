<template>
  <div class="home-container">
    <el-card class="home-card" shadow="hover">
      <h1 class="title">{{ title }}</h1>
      
      <!-- 输入框 -->
      <el-input 
        v-model="question"
        placeholder="请输入健康问题" 
        class="input"
        clearable
      ></el-input>
      
      <!-- 查询按钮 -->
      <el-button 
        @click="queryAnswer" 
        type="primary" 
        class="btn" 
        size="large"
      >
        查询答案
      </el-button>
      
      <!-- 答案显示 -->
      <transition name="fade">
        <el-card v-if="answer" class="answer-card" shadow="never">
          <p>{{ answer }}</p>
        </el-card>
      </transition>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref("健康养生知识问答")
const question = ref("")
const answer = ref("")

const handleLinkJump = () => {
  router.push('/entity-list')
}

const queryAnswer = async () => {
  if (!question.value.trim()) {
    ElMessage.warning("请输入你的健康问题！")
    return
  }
  try {
    const params = new URLSearchParams()
    params.append('question', question.value)
    const res = await request.post('/api/qa/query', params)
   answer.value = res.map((item, index) => `${index + 1}. ${item}`).join('\n');
  } catch (error) {
    answer.value = ""
    ElMessage.error("查询失败，请重试")
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  background: linear-gradient(180deg, #f4f8fb 0%, #eef2f7 100%);
  padding: 40px 0;
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

/* 内容卡片 */
.home-card {
  width: 620px;
  padding: 50px 40px;
  text-align: center;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(64, 158, 255, 0.15);
}

/* 标题字体样式 */
.title {
  font-size: 30px;
  font-weight: 700;
  color: #1e3a8a;
  letter-spacing: 1px;
  margin-bottom: 30px;
}

/* 输入框样式 */
.input {
  margin: 25px 0;
  width: 100%;
  font-size: 16px;
}

/* 按钮样式 */
.btn {
  width: 100%;
  margin-bottom: 25px;
  font-size: 17px;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #409eff, #36a3f7);
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

/* 答案卡片 */
.answer-card {
  margin-top: 25px;
  text-align: left;
  font-size: 16px;
  line-height: 1.8;
  color: #334155;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 18px 20px;
   /* 让 \n 换行生效 */
  white-space: pre-line;
  /* 可选：增加行间距，优化可读性 */
  line-height: 1.8;
  padding: 10px;
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
