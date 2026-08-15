import axios from 'axios';
import { BASE_URL } from './baseUrl';

// Token kerak emas (login, register, refresh)
const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // cookie (refreshToken) bilan ishlash
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosPublic;
