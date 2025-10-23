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
         </el-select>
       </div>
       <!-- 实体表格 -->
       <el-table :data="entityList" :border="true" class="table" style="width: 100%;">
         <el-table-column prop="id" label="ID" width="80"></el-table-column>
         <el-table-column prop="name" label="实体名称" width="200"></el-table-column>
         <el-table-column prop="type" label="类型" width="120"></el-table-column>
         <el-table-column prop="desc" label="简介" >
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
     </div>
   </template>

   <script setup>
   import { ref, onMounted } from 'vue'
   import { useRouter } from 'vue-router'  // 路由跳转
   import request from '../utils/request'
   import { ElMessage } from 'element-plus'

   const router = useRouter()
   // 响应式变量
   const selectedType = ref("")  // 选中的类型
   const entityList = ref([])    // 实体列表数据

   // 页面加载时查询列表
   onMounted(() => {
     getEntityList()
   })

      /**
       * 查询实体列表
       * @returns {Promise<void>} 无返回值
       */
      const getEntityList = async () => {
        try {
          // 发送GET请求获取实体列表数据
          const res = await request.get('/api/entity/list', {
            params: { type: selectedType.value }
          })
          entityList.value = res
        } catch (error) {
          entityList.value = []
        }
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
   </style>
