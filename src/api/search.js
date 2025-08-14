import axios from './config';
import Mock from 'mockjs';

/**
 * 获取热门搜索列表
 * @returns {Promise<{code: number, data: Array<{id: string, keyword: string}>}>}
 */
export const getHotList = async () => {
  if (process.env.NODE_ENV === 'development') {
    // 开发环境使用Mock数据
    return {
      code: 0,
      data: Array.from({ length: 8 }, () => ({
        id: Mock.Random.id(),
        keyword: Mock.Random.ctitle(2, 4)
      }))
    };
  } else {
    // 生产环境调用真实API
    try {
      const res = await axios.get('/hotList');
      return res.data || res; // 兼容不同响应结构
    } catch (error) {
      console.error('获取热门列表失败:', error);
      return { code: -1, data: [] }; // 失败时返回空数组
    }
  }
};

/**
 * 获取搜索建议列表
 * @param {string} keyword 搜索关键词
 * @returns {Promise<{code: number, data: string[]}>}
 */
export const getSuggestList = async (keyword) => {
  if (process.env.NODE_ENV === 'development') {
    // 开发环境使用Mock数据
    const count = Mock.Random.integer(0, 9);
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(`${keyword}${Mock.Random.ctitle(2, 5)}`);
    }
    return { code: 0, data: list };
  } else {
    // 生产环境调用真实API
    try {
      const res = await axios.get('/suggest', { 
        params: { keyword },
        timeout: 3000 
      });
      return res.data || res; // 兼容不同响应结构
    } catch (error) {
      console.error('获取搜索建议失败:', error);
      return { code: -1, data: [] }; // 失败时返回空数组
    }
  }
};

// Mock数据配置（仅开发环境需要）
if (process.env.NODE_ENV === 'development') {
  import('./mock').then(mockModule => {
    const mock = mockModule.default;
    mock.forEach(item => {
      Mock.mock(new RegExp(item.url), item.method, item.response);
    });
  });
}