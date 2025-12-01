<template>
  <div class="home-container">
    <el-card class="home-card" shadow="hover">
      <!-- 标题 -->
      <h1 class="title">{{ title }}</h1>
      
      <!-- 推荐问题区域 -->
      <div class="recommend-questions">
        <p class="recommend-title">推荐问题：</p>
        <div class="recommend-list">
          <el-tag 
            v-for="(item, index) in recommendQuestions" 
            :key="index"
            @click="selectRecommendQuestion(item)"
            class="recommend-tag"
          >
            {{ item }}
          </el-tag>
        </div>
      </div>
      
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
        :loading="isLoading"
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
import { ref, onMounted } from 'vue' 
import { ElMessage, ElTag, ElInput, ElButton, ElCard } from 'element-plus'
import request from '../utils/request'

const title = ref("健康养生知识问答")
const question = ref("")
const answer = ref("")
const isLoading = ref(false)
const recommendQuestions = ref([
  "熬夜后如何快速恢复精力？",
  "春季养生适合吃哪些食物？",
  "如何缓解颈椎疲劳？"
])

// 页面加载时请求推荐问题
onMounted(() => {
  fetchRecommendQuestions()
})

// 请求后端推荐问题
const fetchRecommendQuestions = async () => {
  try {
    const res = await request.get('/api/qa/recommend')
    if (res && res.length > 0) {
      recommendQuestions.value = res.slice(0, 3)
    }
  } catch (error) {
    console.error("获取推荐问题失败（不影响使用）：", error)
  }
}

// 点击推荐问题填充并查询
const selectRecommendQuestion = (q) => {
  question.value = q
  queryAnswer() 
}

// 查询答案核心逻辑
const queryAnswer = async () => {
  if (!question.value.trim()) {
    ElMessage.warning("请输入你的健康问题！")
    return
  }
  
  isLoading.value = true
  answer.value = "" // 清空之前的答案
  
  try {
    const params = new URLSearchParams()
    params.append('question', question.value)
    const res = await request.post('/api/qa/query', params)
    answer.value = res.map((item, index) => `${index + 1}. ${item}`).join('\n');
  } catch (error) {
    // 捕获请求错误，显示友好提示
    console.error('查询答案失败：', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 页面整体布局 */
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  background: linear-gradient(180deg, #f4f8fb 0%, #eef2f7 100%);
  padding: 40px 0;
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

/* 卡片容器 */
.home-card {
  width: 620px;
  padding: 50px 40px;
  text-align: center;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(64, 158, 255, 0.15);
}

/* 标题样式 */
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

/* 答案卡片样式 */
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
  white-space: pre-line;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 推荐问题样式 */
.recommend-questions {
  margin-bottom: 25px;
  text-align: left;
}
.recommend-title {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 12px;
  font-weight: 500;
  margin-top: 0;
}
.recommend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.recommend-tag {
  cursor: pointer;
  background-color: #f0f9ff;
  color: #165dff;
  border-color: #e0efff;
  padding: 6px 14px;
  font-size: 14px;
  transition: all 0.2s;
}
.recommend-tag:hover {
  background-color: #e0efff;
  transform: translateY(-2px);
}
</style>