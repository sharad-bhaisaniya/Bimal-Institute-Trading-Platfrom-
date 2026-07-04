/**
 * Async handler to wrap async route controllers
 * so we don't need try/catch in every controller.
 *
 * Usage: router.get('/route', asyncHandler(myController))
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
