/**
 * JWT Authentication Middleware
 */
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';
import { sendError } from '../utils/responseHandler.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;

  if (!token) {
    return sendError(res, 'Authentication token required. Please log in.', null, 401);
  }

  jwt.verify(token, JWT_CONFIG.secret, (err, decodedUser) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Session expired. Please log in again.', null, 401);
      }
      return sendError(res, 'Invalid authentication token.', null, 403);
    }

    req.user = decodedUser;
    next();
  });
}
