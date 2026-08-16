/**
 * Uniform REST API Response Formatter
 */

export function sendSuccess(res, message = 'Success', data = null, statusCode = 200) {
  const response = {
    success: true,
    message,
    ...(data !== null && data !== undefined ? { data } : {})
  };
  return res.status(statusCode).json(response);
}

export function sendError(res, message = 'An error occurred', errors = null, statusCode = 400) {
  const response = {
    success: false,
    message,
    ...(errors ? { errors: Array.isArray(errors) ? errors : [errors] } : {})
  };
  return res.status(statusCode).json(response);
}
