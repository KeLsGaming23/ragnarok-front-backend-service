/**
 * Admin Authorization Middleware
 * Verifies that authenticated user has rAthena GM level >= 99 (Administrator)
 */
import { sendError } from '../utils/responseHandler.js';

export function requireAdmin(minGroupId = 99) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required. Please log in.', null, 401);
    }

    const userGroupId = parseInt(req.user.groupId ?? req.user.group_id ?? 0, 10);

    if (userGroupId < minGroupId) {
      return sendError(
        res,
        'Access denied. Administrator privileges required (Level 99+).',
        null,
        403
      );
    }

    next();
  };
}
