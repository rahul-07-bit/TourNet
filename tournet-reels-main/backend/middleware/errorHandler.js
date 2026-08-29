const multer = require('multer');

// Catch-all error handler. Registered last in server.js.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message, errors: null });
  }

  if (err.message && err.message.includes('Unsupported')) {
    return res.status(400).json({ success: false, message: err.message, errors: null });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong on the server.',
    errors: null
  });
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}`, errors: null });
}

module.exports = { errorHandler, notFound };
