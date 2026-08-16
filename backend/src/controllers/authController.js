/**
 * Authentication Controller
 */
import { AuthService } from '../services/authService.js';
import { sendSuccess } from '../utils/responseHandler.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password, sex } = req.body;
      const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';

      const result = await AuthService.register({ username, email, password, sex, ip });
      return sendSuccess(
        res,
        'Registration successful! Your KelsGaming RO account has been created.',
        result,
        201
      );
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';

      const result = await AuthService.login({ username, password, ip });
      return sendSuccess(
        res,
        'Welcome back to KelsGaming RO!',
        result,
        200
      );
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res) {
    return sendSuccess(res, 'Successfully logged out of KelsGaming RO.', null, 200);
  }

  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getMe(req.user.accountId);
      return sendSuccess(res, 'User session verified', { user }, 200);
    } catch (err) {
      next(err);
    }
  }
}
