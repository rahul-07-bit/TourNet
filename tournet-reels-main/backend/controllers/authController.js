const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const userModel = require('../models/userModel');

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function sanitizeUser(user) {
  const { password_hash, ...rest } = user;
  return {
    id: rest.id,
    name: rest.name,
    username: rest.username,
    email: rest.email,
    profileImage: rest.profile_image,
    bio: rest.bio,
    createdAt: rest.created_at
  };
}

const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return error(res, 'Name, username, email and password are all required.', 400);
  }
  if (password.length < 6) {
    return error(res, 'Password must be at least 6 characters.', 400);
  }
  if (!/^[a-zA-Z0-9_.]{3,30}$/.test(username)) {
    return error(res, 'Username may only contain letters, numbers, dots and underscores.', 400);
  }

  const existingEmail = await userModel.findByEmail(email);
  if (existingEmail) return error(res, 'An account with this email already exists.', 409);

  const existingUsername = await userModel.findByUsername(username);
  if (existingUsername) return error(res, 'This username is taken.', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser({ name, username, email, passwordHash });
  const user = await userModel.findById(userId);

  const token = signToken(user);
  return success(res, 'Account created successfully.', { token, user: sanitizeUser(user) }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return error(res, 'Email and password are required.', 400);

  const user = await userModel.findByEmail(email);
  if (!user) return error(res, 'Invalid email or password.', 401);

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return error(res, 'Invalid email or password.', 401);

  const token = signToken(user);
  return success(res, 'Logged in successfully.', { token, user: sanitizeUser(user) });
});

const me = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  if (!user) return error(res, 'User not found.', 404);
  return success(res, 'Current user fetched.', { user: sanitizeUser(user) });
});

module.exports = { register, login, me, sanitizeUser };
