<template>
  <div class="list-container">
    <div class="page-title">健康实体列表</div>
    <!-- 筛选条件：按类型筛选 -->
    <div class="filter-bar">
      <el-select 
        v-model="selectedType" 
        placeholder="选择实体类型"
        @change="getEntityList" 
        class="select"
      >
        <el-option label="全部" value=""></el-option>
        <el-option label="疾病" value="疾病"></el-option>
        <el-option label="症状" value="症状"></el-option>
        <el-option label="食材" value="食材"></el-option>
        <el-option label="食谱" value="食谱"></el-option>
        <el-option label="治疗方法" value="治疗方法"></el-option>
        <el-option label="禁忌" value="禁忌"></el-option>
      </el-select>
    </div>
    
    <!-- 实体表格 -->
    <el-table :data="entityList" :border="true" class="table" style="width: 100%;" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="实体名称" width="200"></el-table-column>
      <el-table-column prop="type" label="类型" width="120"></el-table-column>
      <el-table-column prop="desc" label="简介">
        <!-- 内容过长时省略 -->
        <template #default="scope">
          <el-tooltip :content="scope.row.desc" placement="top">
            <div class="desc-text">{{ scope.row.desc }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <!-- 查看详情按钮 -->
          <el-button 
            type="text" 
            @click="goToDetail(scope.row.id)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'  // 路由跳转
import request from '../utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
// 响应式变量
const selectedType = ref("")  // 选中的类型
const entityList = ref([])    // 实体列表数据
const loading = ref(false)    // 加载状态

// 分页参数
const pagination = reactive({
  pageNum: 1,     // 当前页码
  pageSize: 10,   // 每页大小
  total: 0        // 总记录数
})

// 页面加载时查询列表
onMounted(() => {
  getEntityList()
})

/**
 * 获取实体列表
 */
const getEntityList = async () => {
  try {
    loading.value = true
    // 发送GET请求获取实体列表数据，包含分页参数
    const res = await request.get('/api/entity/list', {
      params: { 
        type: selectedType.value,
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize
      }
    })
    
    entityList.value = res.list || res
    pagination.total = res.total || 0
  } catch (error) {
    entityList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

/**
 * 每页条数改变
 * @param {number} val - 新的每页大小
 */
const handleSizeChange = (val) => {
  pagination.pageSize = val
  getEntityList()
}

/**
 * 当前页改变
 * @param {number} val - 新的页码
 */
const handleCurrentChange = (val) => {
  pagination.pageNum = val
  getEntityList()
}

// 跳转到详情页（携带实体ID）
const goToDetail = (id) => {
  router.push({ path: '/entity-detail', query: { id: id } })
}
</script>

<style scoped>
.page-title { font-size: 25px; font-weight: bold; margin-bottom: 10px;padding-left: 25px; }
.list-container { width: 1200px; margin: 30px auto; }
.filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.select { width: 200px; }
.desc-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 600px; }
.pagination-container { margin-top: 20px; text-align: right; }
.table { --el-table-row-hover-bg-color: #f5f7fa; }
</style>