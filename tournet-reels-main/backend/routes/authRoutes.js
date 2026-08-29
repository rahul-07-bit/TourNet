const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Slow down brute-force attempts on auth endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, me);

module.exports = router;
