/**
 * Account API Service
 */
import api from './api';

export const accountService = {
  async getProfile() {
    const res = await api.get('/api/account');
    return res.data;
  },

  async updatePassword(currentPassword, newPassword, confirmNewPassword) {
    const res = await api.put('/api/account/password', {
      currentPassword,
      newPassword,
      confirmNewPassword
    });
    return res;
  },

  async getCharacters() {
    const res = await api.get('/api/account/characters');
    return res.data?.characters || [];
  }
};
