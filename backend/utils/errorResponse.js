/**
 * Custom Error Response class for consistent API error handling.
 *
 * Usage: return next(new ErrorResponse('Not found', 404));
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
