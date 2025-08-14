import axios from './config';

export const getImages = async (page = 1) => {
  try {
    const res = await axios.get('/images', { 
      params: { page },
      timeout: 5000 // 建议添加超时设置
    });
    
    // 统一响应数据结构处理
    if (process.env.NODE_ENV === 'development') {
      // 开发环境Mock数据可能直接返回数组
      return Array.isArray(res) ? res : res?.data?.images || [];
    } else {
      // 生产环境按标准格式返回
      return res?.images || res?.data?.images || [];
    }
  } catch (error) {
    console.error('获取图片失败:', error);
    return []; // 返回空数组避免前端报错
  }
};