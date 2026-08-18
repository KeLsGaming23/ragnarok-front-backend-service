/**
 * Admin API Client Service
 */
import api from './api';

export const adminService = {
  /**
   * Get all dashboard KPI metrics and live diagnostics
   */
  getDashboardStats: async () => {
    const res = await api.get('/api/admin/dashboard/stats');
    return res.data;
  },

  /**
   * Verify current user's administrator role and scopes
   */
  verifyAdmin: async () => {
    const res = await api.get('/api/admin/verify');
    return res.data;
  },

  /**
   * Get filtered list of currently online characters
   */
  getOnlinePlayers: async (params = {}) => {
    const res = await api.get('/api/admin/players/online', { params });
    return res.data;
  },

  /**
   * Deep inspect a character's stats, inventory, storage, and logs
   */
  inspectCharacter: async (charId) => {
    const res = await api.get(`/api/admin/characters/${charId}/inspect`);
    return res.data;
  },

  /**
   * 1-Click Unstuck Character (Teleport to Prontera 155, 180)
   */
  unstuckCharacter: async (charId) => {
    const res = await api.post(`/api/admin/characters/${charId}/unstuck`);
    return res.data;
  },

  /**
   * Reset Character Status / Skill points
   */
  resetCharacterPoints: async (charId, options = {}) => {
    const res = await api.post(`/api/admin/characters/${charId}/reset-points`, options);
    return res.data;
  },

  /**
   * Ban Account
   */
  banAccount: async (accountId, data = {}) => {
    const res = await api.post(`/api/admin/accounts/${accountId}/ban`, data);
    return res.data;
  },

  /**
   * Unban Account
   */
  unbanAccount: async (accountId) => {
    const res = await api.post(`/api/admin/accounts/${accountId}/unban`);
    return res.data;
  }
};
