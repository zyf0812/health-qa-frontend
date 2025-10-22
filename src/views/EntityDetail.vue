<template>
  <div class="detail-container">
    <el-page-header @back="goBack" content="实体详情" class="page-header" />

    <!-- 实体基本信息 -->
    <el-card class="info-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">基本信息</span>
        </div>
      </template>

      <div class="info-content">
        <div class="info-item">
          <span class="label">实体名称：</span>
          <span class="value">{{ entity.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">实体类型：</span>
          <span class="value">{{ entity.type }}</span>
        </div>
        <div class="info-item">
          <span class="label">简介：</span>
          <span class="value">{{ entity.desc }}</span>
        </div>
      </div>
    </el-card>

    <!-- 关联关系列表 -->
    <el-card class="relation-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">关联关系</span>
        </div>
      </template>

      <el-table
        :data="relationList"
        :border ="true"
        stripe
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#f5f7fa', color: '#333', fontWeight: '600' }"
      >
        <el-table-column prop="targetName" label="关联实体" width="250" />
        <el-table-column prop="relType" label="关系类型" width="150" />
        <el-table-column prop="description" label="描述" min-width="300" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '../utils/request'

const router = useRouter()
const route = useRoute()
const entity = ref({ name: '', type: '', desc: '' })
const relationList = ref([])

onMounted(() => {
  const id = route.query.id
  if (id) {
    getEntityDetail(id)
    getRelationList(id)
  } else {
    goBack()
  }
})

const getEntityDetail = async (id) => {
  const res = await request.get(`/api/entity/detail?id=${id}`)
  entity.value = res
}

const getRelationList = async (id) => {
  const res = await request.get(`/api/entity/relation?id=${id}`)
  relationList.value = res
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.detail-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 20px;
}

.el-card {
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 4px;
  border-bottom: 1px solid #ebeef5;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.info-content {
  padding: 20px 10px;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  line-height: 1.6;
}

.label {
  display: inline-block;
  width: 100px;
  color: #606266;
  font-weight: 500;
  text-align: right;
  margin-right: 10px;
}

.value {
  color: #303133;
  flex: 1;
  word-wrap: break-word;
}

.relation-card {
  margin-top: 24px;
}
</style>
