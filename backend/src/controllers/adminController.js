/**
 * Admin Controller - Handles HTTP requests for admin dashboard and moderation
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
}
