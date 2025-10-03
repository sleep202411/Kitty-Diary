import axios from 'axios';

// 判断环境（开发环境/生产环境）
const isProduction = import.meta.env.MODE === 'production';
// Vercel环境变量判断（需要在Vercel控制台设置VITE_VERCEL=1）
const isVercel = import.meta.env.VITE_VERCEL === '1';

// 配置基础路径：
// - 开发环境：使用本地Mock服务
// - Vercel生产环境：使用Vercel的API路由
axios.defaults.baseURL = isProduction && isVercel 
  ? '/api'  // Vercel生产环境（指向Vercel Serverless Functions）
  : '';     // 开发环境（直接访问本地Mock服务）

// 请求拦截器
axios.interceptors.request.use((config) => config);

// 响应拦截器
axios.interceptors.response.use((response) => response);

export default axios;