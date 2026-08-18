/**
 * Admin Controller - Handles HTTP requests for admin dashboard, player monitoring, and moderation
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
}
