import axios from 'axios';
import axiosPublic from './axiosPublic';
import { BASE_URL } from './baseUrl';

// Token kerak (profil, logout, savat)
const axiosAuth = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // refresh cookie ham yuboriladi
  headers: {
    'Content-Type': 'application/json',
  },
});

// Har so'rovga accessToken qo'shamiz
axiosAuth.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

// Access tugasa: cookie dagi refreshToken bilan yangi access olamiz
const refreshAccessToken = async () => {
  const { data } = await axiosPublic.post('/api/auth/refresh');
  localStorage.setItem('accessToken', data.data.accessToken);
  return data.data.accessToken;
};

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Refresh o'zi 401 bersa — qayta urinmaymiz
    if (originalRequest.url?.includes('/api/auth/refresh')) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosAuth(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('accessToken');
      return Promise.reject(refreshError);
    }
  }
);

export default axiosAuth;
