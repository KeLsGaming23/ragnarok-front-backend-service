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
    return res?.data ?? res;
  },

  /**
   * Verify current user's administrator role and scopes
   */
  verifyAdmin: async () => {
    const res = await api.get('/api/admin/verify');
    return res?.data ?? res;
  },

  /**
   * Get filtered list of currently online characters
   */
  getOnlinePlayers: async (params = {}) => {
    const res = await api.get('/api/admin/players/online', { params });
    return res?.data ?? res;
  },

  /**
   * Deep inspect a character's stats, inventory, storage, and logs
   */
  inspectCharacter: async (charId) => {
    const res = await api.get(`/api/admin/characters/${charId}/inspect`);
    return res?.data ?? res;
  },

  /**
   * 1-Click Unstuck Character (Teleport to Prontera 155, 180)
   */
  unstuckCharacter: async (charId) => {
    const res = await api.post(`/api/admin/characters/${charId}/unstuck`);
    return res?.data ?? res;
  },

  /**
   * Reset Character Status / Skill points
   */
  resetCharacterPoints: async (charId, options = {}) => {
    const res = await api.post(`/api/admin/characters/${charId}/reset-points`, options);
    return res?.data ?? res;
  },

  /**
   * Ban Account
   */
  banAccount: async (accountId, data = {}) => {
    const res = await api.post(`/api/admin/accounts/${accountId}/ban`, data);
    return res?.data ?? res;
  },

  /**
   * Unban Account
   */
  unbanAccount: async (accountId) => {
    const res = await api.post(`/api/admin/accounts/${accountId}/unban`);
    return res?.data ?? res;
  },

  /* ========================================================================= */
  /* PHASE 3: ACCOUNTS MANAGEMENT & IP ALTS                                    */
  /* ========================================================================= */

  /**
   * Get list of accounts with multi-search
   */
  getAccounts: async (params = {}) => {
    const res = await api.get('/api/admin/accounts', { params });
    return res?.data ?? res;
  },

  /**
   * Find alt accounts sharing the same IP
   */
  getAltsByIp: async (ip) => {
    const res = await api.get('/api/admin/accounts/alts-by-ip', { params: { ip } });
    return res?.data ?? res;
  },

  /**
   * Promote / Demote GM Level
   */
  updateAccountGmLevel: async (accountId, groupId) => {
    const res = await api.post(`/api/admin/accounts/${accountId}/gm-level`, { groupId });
    return res?.data ?? res;
  },

  /**
   * Reset Kafra 4-digit PIN
   */
  resetAccountPincode: async (accountId) => {
    const res = await api.post(`/api/admin/accounts/${accountId}/reset-pincode`);
    return res?.data ?? res;
  },

  /**
   * Add VIP Subscription time
   */
  addAccountVip: async (accountId, durationDays = 30) => {
    const res = await api.post(`/api/admin/accounts/${accountId}/vip`, { durationDays });
    return res?.data ?? res;
  },

  /* ========================================================================= */
  /* PHASE 3: CHARACTERS LEVEL ADJUSTER & RESTORE                              */
  /* ========================================================================= */

  /**
   * Adjust Base Level & Job Level
   */
  updateCharacterLevels: async (charId, data = {}) => {
    const res = await api.post(`/api/admin/characters/${charId}/levels`, data);
    return res?.data ?? res;
  },

  /**
   * Restore deleted character
   */
  restoreCharacter: async (charId) => {
    const res = await api.post(`/api/admin/characters/${charId}/restore`);
    return res?.data ?? res;
  },

  /* ========================================================================= */
  /* PHASE 3: GUILDS & WAR OF EMPERIUM CASTLES                                 */
  /* ========================================================================= */

  /**
   * Get registered guilds
   */
  getGuilds: async () => {
    const res = await api.get('/api/admin/guilds');
    return res?.data ?? res;
  },

  /**
   * Get WoE Castle ownership
   */
  getCastles: async () => {
    const res = await api.get('/api/admin/castles');
    return res?.data ?? res;
  },

  /* ========================================================================= */
  /* PHASE 4: WEB ITEM & MAIL / RODEX DISPATCHER                               */
  /* ========================================================================= */

  /**
   * Search known items and cards database
   */
  searchItems: async (query = '') => {
    const res = await api.get('/api/admin/items/search', { params: { q: query } });
    return res?.data ?? res;
  },

  /**
   * Dispatch item, zeny, or in-game mail to target character/account
   */
  dispatchItem: async (payload = {}) => {
    const res = await api.post('/api/admin/dispatch/item', payload);
    return res?.data ?? res;
  },

  /* ========================================================================= */
  /* PHASE 5: ITEM DATABASE ENCYCLOPEDIA & CUSTOM ITEM STUDIO                 */
  /* ========================================================================= */

  /**
   * Query item encyclopedia with category, subType, search, and pagination
   */
  getItemDatabase: async (params = {}) => {
    const res = await api.get('/api/admin/items/database', { params });
    return res?.data ?? res;
  },

  /**
   * Get single item deep details
   */
  getItemDetails: async (itemId) => {
    const res = await api.get(`/api/admin/items/details/${itemId}`);
    return res?.data ?? res;
  },

  /**
   * Create or update a custom item
   */
  saveCustomItem: async (itemData) => {
    const res = await api.post('/api/admin/items/custom', itemData);
    return res?.data ?? res;
  },

  /**
   * Delete a custom item
   */
  deleteCustomItem: async (itemId) => {
    const res = await api.delete(`/api/admin/items/custom/${itemId}`);
    return res?.data ?? res;
  },

  /**
   * Export all custom items as rAthena item_db2.yml
   */
  exportCustomItemsYaml: async () => {
    const res = await api.get('/api/admin/items/export-yaml');
    return res?.data ?? res;
  }
};
