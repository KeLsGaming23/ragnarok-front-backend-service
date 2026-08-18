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
  }
};
