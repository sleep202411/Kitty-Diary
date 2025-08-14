import axios from "axios";

const isProduction = import.meta.env.MODE === 'production';
const isVercel = import.meta.env.VITE_VERCEL === '1';

axios.defaults.baseURL = isProduction
  ? '/api'  // 生产环境 & Vercel
  : '/api'; // 本地 mock，也要走 /api

axios.interceptors.request.use((config) => config);

axios.interceptors.response.use((response) => {
  // 这里不要只返回 data，保留完整结构
  return response;
});

export default axios;
