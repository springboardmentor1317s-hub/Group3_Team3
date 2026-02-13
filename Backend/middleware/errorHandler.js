/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error.message = message;
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error.message = message;
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error.message = message;
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error.message = message;
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error.message = message;
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found handler
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: error.message
  });
};