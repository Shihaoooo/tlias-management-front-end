import axios from "axios";

//创建axios实例
const request = axios.create({ baseURL: "/api", timeout: 60000 });

//请求拦截器
request.interceptors.response.use(
  //成功回调函数
  (response) => {
    return response.data;
  },
  //失败回调函数
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

//导出axios实例--request
export default request;
