import axios from "axios";

// ✅ Vite 环境变量
const isProduction = import.meta.env.MODE === 'production';
const isVercel = import.meta.env.VITE_VERCEL === '1'; // 必须以 VITE_ 开头

// 设置基础URL
axios.defaults.baseURL = isProduction
  ? (isVercel ? '/api' : '/api') // 生产环境
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