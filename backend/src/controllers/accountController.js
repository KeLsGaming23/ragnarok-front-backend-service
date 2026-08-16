/**
 * Account Controller - Player Profile & Character Roster
 */
import { AccountService } from '../services/accountService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export class AccountController {
  static async getProfile(req, res, next) {
    try {
      const profile = await AccountService.getAccountDetails(req.user.accountId);
      return sendSuccess(res, 'Account profile retrieved successfully', profile, 200);
    } catch (err) {
      next(err);
    }
  }

  static async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await AccountService.changePassword(req.user.accountId, currentPassword, newPassword);
      return sendSuccess(res, 'Password successfully updated. Please use your new password for your next login.', null, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getCharacters(req, res, next) {
    try {
      const profile = await AccountService.getAccountDetails(req.user.accountId);
      return sendSuccess(res, 'Character list retrieved', { characters: profile.characters }, 200);
    } catch (err) {
      next(err);
    }
  }
}
