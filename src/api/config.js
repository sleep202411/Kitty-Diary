import axios from "axios";

// 环境判断
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1'; // Vercel自动注入的环境变量

// 设置基础URL
axios.defaults.baseURL = isProduction
  ? (isVercel ? '/api' : '/api') // 统一使用/api作为生产环境路径
  : 'http://localhost:5173/api'; // 开发环境

// 请求拦截器
axios.interceptors.request.use((config) => {
  return config;
});

// 响应拦截器
axios.interceptors.response.use((response) => {
  return response.data;
});

export default axios;