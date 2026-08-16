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

  static async getCharacterInventory(req, res, next) {
    try {
      const { charId } = req.params;
      const data = await AccountService.getCharacterInventory(req.user.accountId, parseInt(charId, 10));
      return sendSuccess(res, 'Character inventory retrieved successfully', data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getAccountStorage(req, res, next) {
    try {
      const data = await AccountService.getAccountStorage(req.user.accountId);
      return sendSuccess(res, 'Account storage retrieved successfully', data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async deleteItem(req, res, next) {
    try {
      const { charId, itemId } = req.params;
      const amount = req.body.amount || 1;
      const result = await AccountService.deleteCharacterItem(
        req.user.accountId,
        parseInt(charId, 10),
        parseInt(itemId, 10),
        amount
      );
      return sendSuccess(res, result.message, result, 200);
    } catch (err) {
      next(err);
    }
  }

  static async sendItemMail(req, res, next) {
    try {
      const { charId, itemId } = req.params;
      const { recipientName, amount, title, message } = req.body;
      const result = await AccountService.sendCharacterItemMail(
        req.user.accountId,
        parseInt(charId, 10),
        parseInt(itemId, 10),
        { recipientName, amount: amount || 1, title, message }
      );
      return sendSuccess(res, result.message, result, 200);
    } catch (err) {
      next(err);
    }
  }
}
