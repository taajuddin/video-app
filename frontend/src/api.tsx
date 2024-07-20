import axios from 'axios';

const API_URL = 'http://localhost:4000/api/videos';

export const uploadVideo = async (data: FormData) => {
  const response = await axios.post(`${API_URL}/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getVideos = async (category?: string) => {
  const response = await axios.get(API_URL, {
    params: { category },
  });
  return response.data;
};

export const getVideoById = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  };