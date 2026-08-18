/**
 * Public Item Service
 * API Client for Public Item Encyclopedia & Database
 */
import api from './api';

export const itemService = {
  /**
   * Query public items encyclopedia with category filter, search, sort, and pagination
   */
  getItemDatabase: async (params = {}) => {
    const res = await api.get('/api/items/database', { params });
    return res?.data ?? res;
  },

  /**
   * Get single item complete deep details (stats, script, locations, allowed jobs)
   */
  getItemDetails: async (itemId) => {
    const res = await api.get(`/api/items/details/${itemId}`);
    return res?.data ?? res;
  }
};
