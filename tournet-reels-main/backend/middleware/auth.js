const jwt = require('jsonwebtoken');
const { error } = require('../utils/apiResponse');

// Requires a valid Bearer token. Attaches { id, username } to req.user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return error(res, 'Unauthorized. Please log in.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token.', 401);
  }
}

// Attaches req.user if a valid token is present, but never blocks the
// request. Used on public endpoints that need to know "is this mine?"
// (e.g. reel feed's `savedByMe` / `likedByMe` flags).
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next();

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // ignore invalid token on optional routes
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
