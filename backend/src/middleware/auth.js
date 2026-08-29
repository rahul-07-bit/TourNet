/**
 * middleware/auth.js — TourNet JWT Authentication Middleware
 *
 * Protects Express routes by verifying the JWT access token sent in the
 * Authorization header (Bearer scheme).
 *
 * Usage:
 *   import { protect, restrictTo } from './middleware/auth.js';
 *
 *   router.get('/profile',     protect,                    getProfile);
 *   router.delete('/user/:id', protect, restrictTo('admin'), deleteUser);
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ── protect ───────────────────────────────────────────────────────────────────
/**
 * Verifies the JWT from the Authorization header and attaches `req.user`.
 * Responds with 401 if the token is missing, invalid, or expired.
 */
export async function protect(req, res, next) {
  try {
    // 1. Extract token from "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Also support cookie-based tokens (optional convenience)
    if (!token && req.cookies?.tournet_token) {
      token = req.cookies.tournet_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.',
      });
    }

    // 2. Verify signature + expiry
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[Auth] JWT_SECRET is not configured.');
      return res.status(500).json({ success: false, error: 'Server configuration error.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(401).json({
        success: false,
        error: isExpired ? 'Session expired. Please log in again.' : 'Invalid token. Please log in.',
      });
    }

    // 3. Confirm user still exists and is active
    const user = await User.findById(decoded.id).select('-password -refreshTokens');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists or account is inactive.',
      });
    }

    // 4. Attach to request for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    console.error('[Auth] protect middleware error:', err.message);
    res.status(500).json({ success: false, error: 'Authentication error.' });
  }
}

// ── restrictTo ────────────────────────────────────────────────────────────────
/**
 * Role-based access control middleware factory.
 * Must be placed AFTER `protect` in the middleware chain.
 *
 * @param {...string} roles - Allowed roles, e.g. 'admin', 'guide'
 * @returns Express middleware
 *
 * Example:
 *   router.delete('/user/:id', protect, restrictTo('admin'), deleteUser);
 */
export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of: ${roles.join(', ')}.`,
      });
    }

    next();
  };
}

// ── optionalAuth ─────────────────────────────────────────────────────────────
/**
 * Like `protect`, but does NOT reject unauthenticated requests.
 * Sets `req.user` if a valid token is present, otherwise continues as guest.
 * Useful for public routes that behave differently for logged-in users.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.tournet_token;

    if (!token) return next(); // Guest — proceed without user

    const secret = process.env.JWT_SECRET;
    if (!secret) return next();

    try {
      const decoded = jwt.verify(token, secret);
      const user    = await User.findById(decoded.id).select('-password -refreshTokens');
      if (user && user.isActive) req.user = user;
    } catch {
      // Invalid / expired token — treat as guest
    }

    next();
  } catch (err) {
    next(); // Never block on errors in optional middleware
  }
}
