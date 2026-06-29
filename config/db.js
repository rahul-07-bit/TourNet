/**
 * config/db.js — TourNet MongoDB Atlas Connection
 *
 * Establishes a secure, production-grade Mongoose connection to MongoDB Atlas.
 *
 * Features:
 *   • Singleton connection (no duplicate connects on hot-reload)
 *   • Auto-retry with exponential back-off (up to 5 attempts)
 *   • Graceful shutdown on SIGINT / SIGTERM
 *   • Connection event logging with emoji indicators
 *   • Health-check helper exported for /api/health endpoints
 */

import mongoose from 'mongoose';

// ── Connection state tracker ─────────────────────────────────────────────────
let isConnected = false;

// ── Mongoose global settings ─────────────────────────────────────────────────
// Throw on strict-mode violations so schema mismatches surface early.
mongoose.set('strictQuery', true);

/**
 * connectDB
 *
 * Call once at server start.  Safe to call multiple times — subsequent calls
 * are no-ops when the connection is already established.
 *
 * @param {number} [attempt=1] - Internal retry counter (do not pass manually)
 * @returns {Promise<void>}
 */
export async function connectDB(attempt = 1) {
  const MAX_ATTEMPTS = 5;
  const RETRY_DELAY_MS = Math.min(1000 * 2 ** (attempt - 1), 30_000); // 1 s → 2 s → 4 s … capped at 30 s

  if (isConnected) {
    console.log('🍃 [MongoDB] Already connected — skipping reconnect.');
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      '❌ [MongoDB] MONGODB_URI is not set in your .env file.\n' +
      '   Add it:  MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tournet?retryWrites=true&w=majority'
    );
    if (!process.env.VERCEL) {
      process.exit(1);
    } else {
      throw new Error('MONGODB_URI is not set in environment variables.');
    }
  }

  try {
    console.log(`🔌 [MongoDB] Connecting to Atlas… (attempt ${attempt}/${MAX_ATTEMPTS})`);

    await mongoose.connect(uri, {
      // These are the recommended Atlas options for Mongoose 7+
      serverSelectionTimeoutMS: 10_000,  // Give up after 10 s if server not found
      socketTimeoutMS: 45_000,           // Close sockets after 45 s of inactivity
      maxPoolSize: 10,                   // Maintain up to 10 open sockets
      minPoolSize: 2,                    // Keep at least 2 sockets warm
    });

    isConnected = true;
    console.log(`✅ [MongoDB] Connected to Atlas  →  ${sanitizeUri(uri)}`);

    // ── Connection lifecycle events ──────────────────────────────────────────
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('⚠️  [MongoDB] Disconnected from Atlas.');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('♻️  [MongoDB] Reconnected to Atlas.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('💥 [MongoDB] Connection error:', err.message);
    });

  } catch (err) {
    isConnected = false;
    console.error(`❌ [MongoDB] Connection failed (attempt ${attempt}/${MAX_ATTEMPTS}): ${err.message}`);

    if (attempt < MAX_ATTEMPTS) {
      console.log(`⏳ [MongoDB] Retrying in ${RETRY_DELAY_MS / 1000}s…`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(attempt + 1);
    }

    console.error('💀 [MongoDB] All connection attempts exhausted. Exiting.');
    if (!process.env.VERCEL) {
      process.exit(1);
    } else {
      throw new Error(`All MongoDB connection attempts exhausted: ${err.message}`);
    }
  }
}

/**
 * gracefulShutdown
 *
 * Cleanly closes the Mongoose connection before the process exits.
 * Attach to SIGINT / SIGTERM in server.js.
 *
 * @param {string} signal - The OS signal name for logging
 */
export async function gracefulShutdown(signal) {
  console.log(`\n🛑 [MongoDB] ${signal} received — closing connection…`);
  await mongoose.connection.close();
  console.log('👋 [MongoDB] Connection closed. Bye!');
  process.exit(0);
}

/**
 * getConnectionStatus
 *
 * Returns a plain object suitable for a /api/health endpoint.
 *
 * @returns {{ connected: boolean, state: string, host: string | undefined }}
 */
export function getConnectionStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    connected: isConnected,
    state: states[mongoose.connection.readyState] ?? 'unknown',
    host: mongoose.connection.host,
  };
}

// ── Private helpers ──────────────────────────────────────────────────────────

/**
 * Strips the password from the URI for safe console output.
 * mongodb+srv://user:SECRET@cluster.../db  →  mongodb+srv://user:***@cluster.../db
 */
function sanitizeUri(uri) {
  return uri.replace(/:([^@/]+)@/, ':***@');
}

export default connectDB;
