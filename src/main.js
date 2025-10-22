  import { createApp } from 'vue'
   import App from './App.vue'
   import router from './router'
   // 引入Element Plus
   import ElementPlus from 'element-plus'
   import 'element-plus/dist/index.css'
   // 引入Element Plus图标
   import * as ElementPlusIconsVue from '@element-plus/icons-vue'
   // 引入全局样式
   import './assets/global.css'

   const app = createApp(App)
   // 注册所有图标
   for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
     app.component(key, component)
   }  
   // 使用插件
   app.use(router).use(ElementPlus).mount('#app')
