// src/api/image.js
import axios from './config';

export const getImages = async (page = 1) => {
  const res = await axios.get('/images', { params: { page } });
  return res.data.images;
};
