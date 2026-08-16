/**
 * Axios HTTP Client with JWT Bearer Token Interceptors
 */
import axios from 'axios';

// Clean base URL to prevent duplicate /api/api/ paths if VITE_API_URL contains /api or trailing slash
const rawBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '').replace(/\/$/, '');

const api = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kelsro_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract clean error message & handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 if unauthorized
      localStorage.removeItem('kelsro_token');
      localStorage.removeItem('kelsro_user');
    }

    const customMessage = 
      error.response?.data?.message || 
      (error.response?.data?.errors && error.response.data.errors[0]?.message) ||
      error.message || 
      'An unexpected network error occurred.';

    return Promise.reject(new Error(customMessage));
  }
);

export default api;
