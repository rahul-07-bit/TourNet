/**
 * routes/auth.js — TourNet Authentication Routes
 *
 * POST /api/auth/register   — Create account with email + password
 * POST /api/auth/login      — Login and receive JWT access + refresh tokens
 * POST /api/auth/refresh    — Rotate access token using refresh token
 * POST /api/auth/logout     — Invalidate refresh token
 * GET  /api/auth/me         — Return authenticated user's profile
 * POST /api/auth/forgot-password — Send password-reset email (placeholder)
 *
 * All responses follow the shape:  { success: boolean, data?: any, error?: string }
 */

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Strips fields that should not travel over the wire. */
function safeUser(user) {
  return {
    id:              user._id,
    name:            user.name,
    username:        user.username,
    email:           user.email,
    avatar:          user.avatar,
    bio:             user.bio,
    role:            user.role,
    isEmailVerified: user.isEmailVerified,
    stats:           user.stats,
    preferences:     user.preferences,
    travelInterests: user.travelInterests,
    createdAt:       user.createdAt,
  };
}

/** Issue both tokens and return them along with the safe user object. */
async function issueTokens(user, res) {
  const accessToken  = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  // Persist hashed refresh token (store plain for simplicity; hash in production)
  user.refreshTokens.push(refreshToken);
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      user: safeUser(user),
    },
  });
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long.',
      });
    }

    // Check for existing user
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists.',
      });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password,
      username: username?.trim().toLowerCase() || undefined,
    });

    // Fetch the user with refreshTokens select to add token
    const fullUser = await User.findById(user._id).select('+refreshTokens');
    return issueTokens(fullUser, res);

  } catch (err) {
    // Mongoose duplicate-key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        success: false,
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken.`,
      });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(' ') });
    }

    console.error('[Auth] /register error:', err.message);
    res.status(500).json({ success: false, error: 'Registration failed. Please try again.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    // Fetch with password field (normally excluded)
    const user = await User.findByEmail(email).select('+password +refreshTokens');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: 'This account uses OTP login. Please use the OTP sign-in flow.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    return issueTokens(user, res);

  } catch (err) {
    console.error('[Auth] /login error:', err.message);
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' });
  }
});

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token is required.' });
    }

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    let decoded;

    try {
      decoded = jwt.verify(refreshToken, secret);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token.' });
    }

    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ success: false, error: 'Refresh token not recognised.' });
    }

    // Rotate: remove old, issue new
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);

    const newAccess  = user.generateAuthToken();
    const newRefresh = user.generateRefreshToken();
    user.refreshTokens.push(newRefresh);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: {
        accessToken:  newAccess,
        refreshToken: newRefresh,
        expiresIn:    process.env.JWT_EXPIRES_IN || '7d',
      },
    });
  } catch (err) {
    console.error('[Auth] /refresh error:', err.message);
    res.status(500).json({ success: false, error: 'Token refresh failed.' });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', protect, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findById(req.user._id).select('+refreshTokens');
    if (user && refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.error('[Auth] /logout error:', err.message);
    res.status(500).json({ success: false, error: 'Logout failed.' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    res.status(200).json({ success: true, data: { user: safeUser(user) } });
  } catch (err) {
    console.error('[Auth] /me error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch profile.' });
  }
});

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  // TODO: integrate with the existing Resend/Nodemailer email flow in server.js
  res.status(200).json({
    success: true,
    message: 'If an account with that email exists, a reset link has been sent.',
  });
});

export default router;
