// This middleware handles errors in one place.
// Centralized error handling keeps controllers and services cleaner.
const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong.",
  });
};

module.exports = {
  errorHandler,
};
