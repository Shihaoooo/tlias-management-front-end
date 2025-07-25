import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router/index";
//创建axios实例
const request = axios.create({ baseURL: "/api", timeout: 60000 });
//请求拦截器(加入token的请求头)
request.interceptors.request.use(
  // 成功回调
  (config) => {
    // 获取JWT令牌
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));

    // 如果有令牌，则加入请求头
    if (loginUser && loginUser.token) {
      config.headers.token = loginUser.token;
    }
    return config;
  }
);
//响应拦截器
request.interceptors.response.use(
  //成功回调函数
  (response) => {
    return response.data;
  },
  //失败回调函数
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      // 提示信息
      ElMessage.error("登录超时,请重试");

      // 跳转到登录页面
      router.push("/login");
    } else {
      // 提示信息
      ElMessage.error("接口访问异常");
    }
    return Promise.reject(error);
  }
);

//导出axios实例--request
export default request;
