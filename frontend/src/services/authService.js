/**
 * Authentication API Service
 */
import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/api/auth/register', data);
    return res;
  },

  async login(data) {
    const res = await api.post('/api/auth/login', data);
    return res;
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Ignore network failure on logout
    }
  },

  async getMe() {
    const res = await api.get('/api/auth/me');
    return res.data?.user;
  }
};
