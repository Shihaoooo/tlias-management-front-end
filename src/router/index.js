import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '../views/layout/index.vue'
import IndexView from '../views/index/index.vue'
import ClazzView from '../views/clazz/index.vue'
import DeptView from '../views/dept/index.vue'
import EmpView from '../views/emp/index.vue'
import Logview from '../views/log/index.vue'
import Stuview from '../views/stu/index.vue'
import EmpReportView from '../views/report/emp/index.vue'
import StuReportView from '../views/report/stu/index.vue'
import LoginView from '../views/login/index.vue'


//创建一个路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 注意name的属性值不能重复！
    {

      //“/”是根路由（App.vue）
      path: '/',
      name:' ',
      component:LayoutView,

      //重定向（处理如果请求了不存在的路由时，自动重定向到正确的路由）
      redirect:"/index",
      children:[
        {path:"index",name:"index",component:IndexView},
        {path:"clazz",name:"clazz",component:ClazzView},
        {path:"dept",name:"dept",component:DeptView},
        {path:"emp",name:"emp",component:EmpView},
        {path:"log",name:"log",component:Logview},
        {path:"stu",name:"stu",component:Stuview},
        {path:"empReport",name:"empReport",component:EmpReportView},
        {path:"stuReport",name:"stuReport",component:StuReportView}
      ]
    },
    {path:"/login",name:"login",component:LoginView}
  ]
})

export default router
