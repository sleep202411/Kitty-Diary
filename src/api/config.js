import axios from "axios";
import { default as mockApis } from '../mock/data';

const isDev = import.meta.env.MODE === 'development';
const isVercel = import.meta.env.VITE_VERCEL === '1';

const shouldUseMock = (url) => {
  const mockApisForVercel = ['/config', '/images', '/hotList', '/suggest'];
  return isDev || (isVercel && mockApisForVercel.includes(url));
};

const mockRequest = (url, method, params = {}) => {
  const mockApi = mockApis.find(item => item.url === url && item.method.toLowerCase() === method.toLowerCase());
  if (mockApi) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = typeof mockApi.response === 'function' ? mockApi.response({ query: params }) : mockApi.response;
        resolve({ data: response });
      }, mockApi.timeout || 0);
    });
  }
  return Promise.reject(new Error('Mock API not found'));
};

const api = axios.create({
  baseURL: isDev ? '' : import.meta.env.VITE_VERCEL_API_BASE_URL || '/api',
  timeout: 5000
});

const request = async (url, method, params = {}) => {
  if (shouldUseMock(url)) {
    return mockRequest(url, method, params);
  }
  return method.toLowerCase() === 'get' ? api.get(url, { params }) : api[method.toLowerCase()](url, params);
};

export default {
  get: (url, params) => request(url, 'get', params),
  post: (url, params) => request(url, 'post', params),
  put: (url, params) => request(url, 'put', params),
  delete: (url, params) => request(url, 'delete', params)
};