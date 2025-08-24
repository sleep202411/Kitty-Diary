import api from './config';

/**
 * 获取热门搜索列表
 * @returns {Promise<{code:number, data:Array<{id:string, keyword:string}>}>} 
 */
export const getHotList = async () => {
  try {
    const res = await api.get('/hotList'); // 调用 /api/hotList
    const data = res.data;

    return data.code === 0 ? data : { code: -1, data: [] };
  } catch (e) {
    console.error('获取热门列表失败:', e);
    return { code: -1, data: [] };
  }
};

/**
 * 获取搜索建议列表
 * @param {string} keyword 搜索关键词
 * @returns {Promise<{code:number, data:string[]}>} 
 */
export const getSuggestList = async (keyword) => {
  try {
    const res = await api.get('/suggest', { keyword });
    const data = res.data;

    return data.code === 0 ? data : { code: -1, data: [] };
  } catch (e) {
    console.error('获取搜索建议失败:', e);
    return { code: -1, data: [] };
  }
};