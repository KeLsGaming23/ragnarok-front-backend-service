/**
 * Admin Controller - Handles HTTP requests for admin dashboard, player monitoring, accounts, characters, guilds, and moderation
 */
import { AdminService } from '../services/adminService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export class AdminController {
  /**
   * GET /api/admin/dashboard/stats
   */
  static async getDashboardStats(req, res, next) {
    try {
      const data = await AdminService.getDashboardStats();
      sendSuccess(res, 'Admin dashboard statistics retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/verify
   */
  static async verifyAdmin(req, res, next) {
    try {
      const result = AdminService.verifyAdminPermissions(req.user);
      sendSuccess(res, 'Administrator verified', result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/players/online
   */
  static async getOnlinePlayers(req, res, next) {
    try {
      const { search, map, classId, onlineOnly, page, limit } = req.query;
      const isOnlineOnly = onlineOnly === undefined ? true : (onlineOnly === 'true' || onlineOnly === true);
      const data = await AdminService.getOnlinePlayers({
        search,
        map,
        classId: classId ? parseInt(classId, 10) : null,
        onlineOnly: isOnlineOnly,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 50
      });
      sendSuccess(res, 'Players retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/characters/:charId/inspect
   */
  static async getCharacterInspector(req, res, next) {
    try {
      const { charId } = req.params;
      const data = await AdminService.inspectCharacter(charId);
      sendSuccess(res, 'Character details retrieved for inspection', data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/characters/:charId/unstuck
   */
  static async unstuckCharacter(req, res, next) {
    try {
      const { charId } = req.params;
      const result = await AdminService.unstuckCharacter(charId, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/characters/:charId/reset-points
   */
  static async resetCharacterPoints(req, res, next) {
    try {
      const { charId } = req.params;
      const { resetStats = true, resetSkills = true } = req.body || {};
      const result = await AdminService.resetCharacterPoints(charId, { resetStats, resetSkills }, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/accounts/:accountId/ban
   */
  static async banAccount(req, res, next) {
    try {
      const { accountId } = req.params;
      const { durationHours = 0, reason = 'Administrative Action' } = req.body || {};
      const result = await AdminService.banAccount(accountId, { durationHours, reason }, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/accounts/:accountId/unban
   */
  static async unbanAccount(req, res, next) {
    try {
      const { accountId } = req.params;
      const result = await AdminService.unbanAccount(accountId, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }

  /* ========================================================================= */
  /* PHASE 3: ACCOUNTS MANAGEMENT & IP ALTS                                    */
  /* ========================================================================= */

  /**
   * GET /api/admin/accounts
   */
  static async getAccounts(req, res, next) {
    try {
      const { search, state, minGroupId, page, limit } = req.query;
      const data = await AdminService.getAccounts({
        search,
        state,
        minGroupId,
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 50
      });
      sendSuccess(res, 'Accounts retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/accounts/alts-by-ip
   */
  static async getAltsByIp(req, res, next) {
    try {
      const { ip } = req.query;
      const data = await AdminService.getAltsByIp(ip);
      sendSuccess(res, 'Accounts sharing IP retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/accounts/:accountId/gm-level
   */
  static async updateAccountGmLevel(req, res, next) {
    try {
      const { accountId } = req.params;
      const { groupId } = req.body || {};
      const result = await AdminService.updateAccountGmLevel(accountId, groupId, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/accounts/:accountId/reset-pincode
   */
  static async resetAccountPincode(req, res, next) {
    try {
      const { accountId } = req.params;
      const result = await AdminService.resetAccountPincode(accountId, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/accounts/:accountId/vip
   */
  static async addAccountVip(req, res, next) {
    try {
      const { accountId } = req.params;
      const { durationDays = 30 } = req.body || {};
      const result = await AdminService.addAccountVip(accountId, durationDays, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }

  /* ========================================================================= */
  /* PHASE 3: CHARACTERS LEVEL ADJUSTER & RESTORE                              */
  /* ========================================================================= */

  /**
   * POST /api/admin/characters/:charId/levels
   */
  static async updateCharacterLevels(req, res, next) {
    try {
      const { charId } = req.params;
      const { baseLevel, jobLevel } = req.body || {};
      const result = await AdminService.updateCharacterLevels(charId, { baseLevel, jobLevel }, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/characters/:charId/restore
   */
  static async restoreCharacter(req, res, next) {
    try {
      const { charId } = req.params;
      const result = await AdminService.restoreCharacter(charId, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }

  /* ========================================================================= */
  /* PHASE 3: GUILDS & WAR OF EMPERIUM CASTLES                                 */
  /* ========================================================================= */

  /**
   * GET /api/admin/guilds
   */
  static async getGuilds(req, res, next) {
    try {
      const data = await AdminService.getGuilds();
      sendSuccess(res, 'Guilds retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/admin/castles
   */
  static async getCastles(req, res, next) {
    try {
      const data = await AdminService.getCastles();
      sendSuccess(res, 'Castle ownership retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  }

  /* ========================================================================= */
  /* PHASE 4: WEB ITEM & MAIL / RODEX DISPATCHER                               */
  /* ========================================================================= */

  /**
   * GET /api/admin/items/search
   */
  static async searchItems(req, res, next) {
    try {
      const { q } = req.query;
      const data = AdminService.searchItems(q);
      sendSuccess(res, 'Items retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/admin/dispatch/item
   */
  static async dispatchItem(req, res, next) {
    try {
      const result = await AdminService.dispatchItemOrMail(req.body, req.user);
      sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  }
}
