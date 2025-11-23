<template>
  <div class="home-container">
    <el-card class="home-card" shadow="hover">
      <h1 class="title">{{ title }}</h1>
      
      <!-- 新增：推荐问题区域（不影响原有布局） -->
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
      
      <!-- 原有输入框 -->
      <el-input 
        v-model="question"
        placeholder="请输入健康问题" 
        class="input"
        clearable
      ></el-input>
      
      <!-- 原有查询按钮 -->
      <el-button 
        @click="queryAnswer" 
        type="primary" 
        class="btn" 
        size="large"
      >
        查询答案
      </el-button>
      
      <!-- 原有答案显示 -->
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
import { ElMessage } from 'element-plus'
import request from '../utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref("健康养生知识问答")
const question = ref("")
const answer = ref("")
// 存储推荐问题（默认3个，避免请求失败时空白）
const recommendQuestions = ref([
  "熬夜后如何快速恢复精力？",
  "春季养生适合吃哪些食物？",
  "如何缓解颈椎疲劳？"
])

const handleLinkJump = () => {
  router.push('/entity-list')
}

// 页面加载时请求推荐问题
onMounted(() => {
  fetchRecommendQuestions()
})

// 请求后端推荐问题（使用原有 request 工具，路径保持 /api/qa/recommend）
const fetchRecommendQuestions = async () => {
  try {
    const res = await request.get('/api/qa/recommend')
    // 若后端返回有效数组，替换默认问题；否则保留默认
    if (res && res.length > 0) {
      recommendQuestions.value = res.slice(0, 3)
    }
  } catch (error) {
    console.error("获取推荐问题失败（不影响使用）：", error)
    // 失败后不修改推荐问题，继续显示默认标签
  }
}

// 点击推荐问题填充到输入框并查询
const selectRecommendQuestion = (q) => {
  question.value = q
  queryAnswer() 
}

// 查询答案
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

.home-card {
  width: 620px;
  padding: 50px 40px;
  text-align: center;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(64, 158, 255, 0.15);
}

.title {
  font-size: 30px;
  font-weight: 700;
  color: #1e3a8a;
  letter-spacing: 1px;
  margin-bottom: 30px;
}

.input {
  margin: 25px 0;
  width: 100%;
  font-size: 16px;
}

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
  line-height: 1.8;
  padding: 10px;
}

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