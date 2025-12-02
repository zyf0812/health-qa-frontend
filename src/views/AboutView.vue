<template>
  <div class="about-container">
    <h2 class="about-title">关于健康实体查询系统</h2>
    
    <div class="about-content">
      <p>健康实体查询系统
本系统是一款聚焦健康养生领域的专业信息查询平台，致力于为用户提供全面、精准、易懂的健康相关实体信息服务，覆盖疾病、症状、食材、食谱、治疗方法、禁忌项目等多类核心健康实体，助力用户快速获取权威知识，搭建个人健康认知体系。</p>
      
      <h3>系统功能</h3>
      <ul>
        <li>健康实体列表浏览与筛选</li>
        <li>实体详情信息查看</li>
        <li>健康问题智能查询与解答</li>
      </ul>
      
      <h3>系统数据统计</h3>
      <div v-if="statsLoading" class="stats-loading">加载中...</div>
      <div v-else class="stats-container">
        <p>已收录健康实体总数：{{ stats?.totalEntities || 0 }}</p>
        <p>涵盖疾病类型数：{{ stats?.diseaseCount || 0 }}</p>
        <p>涵盖食材种类数：{{ stats?.foodCount || 0 }}</p>
      </div>
      
      <h3>联系方式</h3>
      <p>邮箱：217****317@qq.com</p>
      <p>电话：186****3351</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request' // 假设已封装axios请求工具

const stats = ref(null)
const statsLoading = ref(true)

// 获取系统数据统计
const getSystemStats = async () => {
  try {
    statsLoading.value = true
    const res = await request.get('/api/system/stats')
    stats.value = res
  } catch (error) {
    console.error('获取系统统计失败：', error)
    stats.value = { totalEntities: '未知', diseaseCount: '未知', foodCount: '未知' }
  } finally {
    statsLoading.value = false
  }
}

onMounted(() => {
  getSystemStats()
})
</script>

<style scoped>
.about-container {
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.about-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.about-content {
  line-height: 1.8;
  color: #333;
}

.about-content h3 {
  font-size: 18px;
  margin: 20px 0 10px;
}

.about-content ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.about-content p {
  margin-bottom: 10px;
}

.stats-loading {
  color: #666;
  font-style: italic;
}

.stats-container {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}
</style>