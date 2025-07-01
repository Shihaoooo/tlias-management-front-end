import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
// 引入element-plus的样式文件
import 'element-plus/dist/index.css'
// 引入中文字体包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入element-plus的icon集合包
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus,{locale:zhCn})
//为element-plus的icon组件注册全局组件
for (const {key,component} of Object.entries(ElementPlusIconsVue)){
    app.component(key,component)
}

app.mount('#app')


