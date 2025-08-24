import api from './config';

/**
 * 获取瀑布流图片
 * @param {number} page 页码
 * @returns {Promise<{images: Array, hasMore: boolean}>} 
 */
export const getImages = async (page = 1) => {
  try {
    const res = await api.get('/images', { page });
    const data = res.data;

    return data.code === 0 ? data.data : { images: [], hasMore: false };
  } catch (e) {
    console.error('获取图片失败:', e);
    return { images: [], hasMore: false };
  }
};