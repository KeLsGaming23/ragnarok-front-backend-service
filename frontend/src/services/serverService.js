/**
 * Server Status & Download API Service
 */
import api from './api';

export const serverService = {
  async getServerStatus(forceRefresh = false) {
    const res = await api.get(`/api/server/status${forceRefresh ? '?refresh=true' : ''}`);
    return res.data;
  },

  async getOnlinePlayers() {
    const res = await api.get('/api/server/players');
    return res.data?.onlinePlayers || 0;
  },

  async getServerInfo() {
    const res = await api.get('/api/server/info');
    return res.data;
  },

  async getDownloads() {
    const res = await api.get('/api/downloads');
    return res.data;
  }
};
