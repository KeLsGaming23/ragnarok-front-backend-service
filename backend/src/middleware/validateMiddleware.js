/**
 * Zod Schema Validation Middleware
 */
import { sendError } from '../utils/responseHandler.js';

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const validationErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return sendError(res, validationErrors[0]?.message || 'Validation failed', validationErrors, 422);
      }
      return sendError(res, 'Invalid request data', null, 400);
    }
  };
}
