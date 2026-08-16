/**
 * Centralized Error Handling Middleware
 */
import { sendError } from '../utils/responseHandler.js';

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error safely (excluding credentials)
  if (statusCode >= 500) {
    console.error(`[Server Error] [${req.method}] ${req.originalUrl}:`, err.stack || err.message);
  }

  return sendError(
    res,
    statusCode >= 500 && process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred on the server.' 
      : message,
    err.errors || null,
    statusCode
  );
}

export function notFoundHandler(req, res) {
  return sendError(res, `API route not found: ${req.method} ${req.originalUrl}`, null, 404);
}
