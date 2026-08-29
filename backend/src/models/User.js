/**
 * models/User.js — TourNet User Schema
 *
 * Mongoose schema for TourNet users.
 *
 * Design decisions:
 *   • Passwords are hashed with bcrypt (12 salt rounds) via a pre-save hook —
 *     plain-text passwords are NEVER stored.
 *   • comparePassword() is an instance method to keep auth logic co-located.
 *   • generateAuthToken() issues a signed JWT (no session state needed).
 *   • The `supabaseId` field keeps the existing Supabase auth bridge intact.
 *   • `role` allows simple RBAC (user / guide / admin) for future routes.
 *   • Soft-delete via `isActive` flag — records are never hard-deleted.
 *   • All sensitive fields (password, tokens) are excluded from JSON output.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Schema, model } = mongoose;

// ── Sub-schemas ──────────────────────────────────────────────────────────────

const locationSchema = new Schema({
  type:        { type: String, enum: ['Point'], default: 'Point' },
  coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
}, { _id: false });

const socialLinksSchema = new Schema({
  instagram: { type: String, default: '' },
  twitter:   { type: String, default: '' },
  website:   { type: String, default: '' },
}, { _id: false });

const statsSchema = new Schema({
  reelsPosted:    { type: Number, default: 0 },
  placesVisited:  { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  likesReceived:  { type: Number, default: 0 },
}, { _id: false });

// ── Main User Schema ─────────────────────────────────────────────────────────

const userSchema = new Schema(
  {
    // ── Identity ─────────────────────────────────────────────────────────────
    name: {
      type:      String,
      required:  [true, 'Full name is required'],
      trim:      true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },

    username: {
      type:      String,
      unique:    true,
      sparse:    true,      // allows null/undefined (set on first profile update)
      trim:      true,
      lowercase: true,
      match:     [/^[a-z0-9_]{3,30}$/, 'Username: 3-30 chars, letters / numbers / underscores only'],
    },

    email: {
      type:      String,
      required:  [true, 'Email address is required'],
      unique:    true,
      trim:      true,
      lowercase: true,
      match:     [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
    },

    // ── Credentials (server-side auth path) ──────────────────────────────────
    password: {
      type:   String,
      select: false,        // Never returned in queries unless explicitly requested
      // Not required — users can authenticate via OTP or Supabase OAuth only
    },

    // ── Supabase auth bridge ──────────────────────────────────────────────────
    // Stores the Supabase user UUID so we can cross-reference sessions.
    supabaseId: {
      type:   String,
      sparse: true,
      select: false,
    },

    // ── Profile ───────────────────────────────────────────────────────────────
    avatar: {
      type:    String,
      default: '',        // URL or empty string (frontend shows initials fallback)
    },

    bio: {
      type:      String,
      default:   '',
      maxlength: [300, 'Bio cannot exceed 300 characters'],
    },

    location: {
      city:    { type: String, default: '' },
      country: { type: String, default: 'India' },
      geo:     locationSchema,
    },

    socialLinks: { type: socialLinksSchema, default: () => ({}) },

    // ── Access & roles ────────────────────────────────────────────────────────
    role: {
      type:    String,
      enum:    ['user', 'guide', 'admin'],
      default: 'user',
    },

    isActive: {
      type:    Boolean,
      default: true,
      index:   true,
    },

    isEmailVerified: {
      type:    Boolean,
      default: false,
    },

    // ── Refresh tokens (stored hashed for JWT rotation strategy) ─────────────
    refreshTokens: {
      type:   [String],
      select: false,
      default: [],
    },

    // ── TourNet-specific ──────────────────────────────────────────────────────
    stats:           { type: statsSchema, default: () => ({}) },
    savedReels:      [{ type: Schema.Types.ObjectId, ref: 'Reel' }],
    savedPlaces:     [{ type: Schema.Types.ObjectId, ref: 'Place' }],
    travelInterests: {
      type:    [String],
      default: [],
      // e.g. ['spiritual', 'himalayan', 'heritage', 'food']
    },

    // ── Preferences ───────────────────────────────────────────────────────────
    preferences: {
      notifications: { type: Boolean, default: true },
      darkMode:      { type: Boolean, default: true },
      language:      { type: String,  default: 'en' },
      currency:      { type: String,  default: 'INR' },
    },

    // ── Password reset ────────────────────────────────────────────────────────
    passwordResetToken:   { type: String, select: false },
    passwordResetExpires: { type: Date,   select: false },

    // ── Last activity ─────────────────────────────────────────────────────────
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,          // adds createdAt + updatedAt automatically
    versionKey: '__v',
    toJSON:  { virtuals: true, transform: sanitize },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true, sparse: true });
userSchema.index({ 'location.geo': '2dsphere' });   // Geo queries for nearby users
userSchema.index({ role: 1, isActive: 1 });

// ── Virtuals ─────────────────────────────────────────────────────────────────
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.virtual('initials').get(function () {
  return this.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

// ── Pre-save hook: hash password ─────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash when the password field has actually changed
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt   = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ── Instance methods ──────────────────────────────────────────────────────────

/**
 * comparePassword
 *
 * Safely compare a plain-text candidate against the stored bcrypt hash.
 * Requires the user document to have been fetched with `.select('+password')`.
 *
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * generateAuthToken
 *
 * Creates a signed JWT access token.
 * Payload is kept minimal to reduce token size and avoid leaking data.
 *
 * @returns {string} Signed JWT
 */
userSchema.methods.generateAuthToken = function () {
  const secret  = process.env.JWT_SECRET;
  const expires = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables.');
  }

  return jwt.sign(
    {
      id:    this._id,
      email: this.email,
      role:  this.role,
    },
    secret,
    { expiresIn: expires }
  );
};

/**
 * generateRefreshToken
 *
 * Creates a long-lived refresh token (30 days).
 * Store the returned token in the `refreshTokens` array (hashed ideally).
 *
 * @returns {string} Signed refresh JWT
 */
userSchema.methods.generateRefreshToken = function () {
  const secret  = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  const expires = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables.');
  }

  return jwt.sign({ id: this._id }, secret, { expiresIn: expires });
};

// ── Static methods ────────────────────────────────────────────────────────────

/**
 * findByEmail
 *
 * Convenience wrapper. Use this instead of `User.findOne({ email })` to ensure
 * consistent case-normalisation across the codebase.
 *
 * @param {string} email
 * @returns {Promise<import('mongoose').Document>}
 */
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.trim().toLowerCase() });
};

// ── Transform: strip sensitive fields from JSON output ───────────────────────
function sanitize(doc, ret) {
  delete ret._id;
  delete ret.__v;
  delete ret.password;
  delete ret.supabaseId;
  delete ret.refreshTokens;
  delete ret.passwordResetToken;
  delete ret.passwordResetExpires;
  return ret;
}

// ── Export ────────────────────────────────────────────────────────────────────
const User = model('User', userSchema);
export default User;
