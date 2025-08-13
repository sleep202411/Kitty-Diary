import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5173/api'

axios.interceptors.request.use((config) => {
  return config
})

axios.interceptors.response.use((response) => {
  // console.log('响应拦截器 - 响应数据:', response);
  return response.data
})

export default axios