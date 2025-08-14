import axios from './config';

export const getImages = async (page = 1) => {
  try {
    const res = await axios.get('/images', { 
      params: { page },
      timeout: 5000
    });
    
    // 开发环境判断改用 import.meta.env
    if (import.meta.env.MODE === 'development') {
      return Array.isArray(res) ? res : res?.data?.images || [];
    } else {
      return res?.images || res?.data?.images || [];
    }
  } catch (error) {
    console.error('获取图片失败:', error);
    return [];
  }
};