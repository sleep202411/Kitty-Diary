import axios from 'axios';

// 判断是否是生产环境
const isProduction = import.meta.env.MODE === 'production';
const isVercel = import.meta.env.VITE_VERCEL === '1';

// 配置 axios 的基本路径
axios.defaults.baseURL = isProduction ? '/api' : '/api';  // 本地和 Vercel 都指向 /api

// 请求拦截器
axios.interceptors.request.use((config) => config);

// 响应拦截器
axios.interceptors.response.use((response) => response);

export default axios;
