/**
 * server.js — TourNet Express Backend Server
 *
 * Handles:
 *   • MongoDB Atlas connection via Mongoose
 *   • JWT-based authentication routes  (/api/auth/*)
 *   • Secure OTP generation + verification (Supabase bridge)
 *   • Reel upload & serving
 *   • Email dispatch via Resend / Nodemailer
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Load .env first — must be before any other imports that read env vars ───
dotenv.config();

// ── MongoDB Atlas connection ──────────────────────────────────────────────────
import { connectDB, gracefulShutdown, getConnectionStatus } from './config/db.js';

// ── Auth routes (JWT + Mongoose) ─────────────────────────────────────────────
import authRouter from './routes/auth.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ── Mount auth router ─────────────────────────────────────────────────────────
// All routes: POST /api/auth/register, /api/auth/login, /api/auth/refresh,
//             POST /api/auth/logout,   GET  /api/auth/me
app.use('/api/auth', authRouter);

// ── Health check (includes MongoDB status) ───────────────────────────────────
app.get('/api/health', (_req, res) => {
  const db = getConnectionStatus();
  res.status(db.connected ? 200 : 503).json({
    status: db.connected ? 'ok' : 'degraded',
    service: 'TourNet API',
    database: db,
    timestamp: new Date().toISOString(),
  });
});

// Initialize Supabase Admin Client. Support both the frontend VITE_ names and the
// backend SUPABASE_ names so the project works in dev and deploy environments.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} else {
  console.error(
    '[TourNet Backend] ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in environment variables.'
  );
}

// ─────────────────────────────────────────────────────────────
// EMAIL UTILS
// ─────────────────────────────────────────────────────────────

/** Send email with secure OTP */
async function sendOtpEmail(email, otp) {
  const subject = 'TourNet Verification Code';
  const textContent = `Your TourNet verification code is: ${otp}. This code is valid for 5 minutes.`;
  const htmlContent = `
    <div style="font-family: 'Inter', sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ff9933; border-radius: 12px; background-color: #05030e; color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #ff9933; margin: 0;">TourNet Authentication</h2>
      </div>
      <p style="font-size: 14px; line-height: 1.5; color: #e0d0c0;">Hello,</p>
      <p style="font-size: 14px; line-height: 1.5; color: #e0d0c0;">Use the following verification code to complete your sign in/sign up process:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.15em; color: #ff8800; background: rgba(255, 153, 51, 0.1); padding: 10px 20px; border-radius: 8px; border: 1px dashed #ff9933;">${otp}</span>
      </div>
      <p style="font-size: 12px; color: rgba(255, 255, 255, 0.4); line-height: 1.4;">This code is valid for <strong>5 minutes</strong> and can only be used once. If you did not request this code, please ignore this email.</p>
    </div>
  `;

  // 1. Try Resend API first
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'TourNet <onboarding@resend.dev>',
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
      });
      return;
    } catch (err) {
      console.error('[TourNet Backend] Resend API failed, trying fallback SMTP:', err.message);
    }
  }

  // 2. Try Nodemailer SMTP fallback
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TourNet" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      text: textContent,
      html: htmlContent,
    });
    return;
  }

  throw new Error('Email service is not configured. Set RESEND_API_KEY or SMTP credentials in .env.');
}

// ─────────────────────────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────────────────────────

/** Request and send OTP */
app.post('/api/auth/send-otp', async (req, res) => {
  const { email, name } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Enter a valid email address' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({
      success: false,
      error: 'Authentication service is temporarily unavailable. Please try again later.'
    });
  }

  try {
    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Insert OTP verification record into the DB
    const { error: dbError } = await supabaseAdmin
      .from('otp_verifications')
      .insert({
        email: email.trim().toLowerCase(),
        otp, // Note: For highest production security, this can be hashed. Here we store it in a restricted RLS table.
        expires_at: expiresAt.toISOString(),
        verified: false,
        attempts: 0
      });

    if (dbError) throw dbError;

    // Send the email
    await sendOtpEmail(email.trim().toLowerCase(), otp);

    return res.status(200).json({ success: true, message: 'OTP Sent Successfully' });
  } catch (err) {
    console.error('[TourNet Backend] Send OTP failure:', err.message);
    return res.status(500).json({ success: false, error: err.message || 'Failed to send OTP' });
  }
});

/** Verify OTP and complete authentication */
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp, name } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP code are required' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({
      success: false,
      error: 'Authentication service is temporarily unavailable. Please try again later.'
    });
  }

  try {
    const formattedEmail = email.trim().toLowerCase();

    // Fetch the latest unverified OTP record
    const { data: records, error: dbError } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('email', formattedEmail)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (dbError) throw dbError;

    if (!records || records.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid OTP. Please try again.' });
    }

    const record = records[0];

    // Check maximum attempts limit (5 attempts)
    if (record.attempts >= 5) {
      return res.status(400).json({
        success: false,
        error: 'Maximum verification attempts exceeded. Please request a new OTP.'
      });
    }

    // Check if expired
    const isExpired = new Date(record.expires_at) < new Date();
    if (isExpired) {
      return res.status(400).json({ success: false, error: 'OTP Expired. Request a new OTP.' });
    }

    // Match OTP exactly
    if (otp.trim() !== record.otp.trim()) {
      const nextAttempts = record.attempts + 1;
      await supabaseAdmin
        .from('otp_verifications')
        .update({ attempts: nextAttempts })
        .eq('id', record.id);

      if (nextAttempts >= 5) {
        return res.status(400).json({
          success: false,
          error: 'Maximum verification attempts exceeded. Please request a new OTP.'
        });
      }

      return res.status(400).json({
        success: false,
        error: `Invalid OTP. Please try again. (${5 - nextAttempts} attempts remaining)`,
        attemptsLeft: 5 - nextAttempts
      });
    }

    // Mark as verified
    await supabaseAdmin
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', record.id);

    // Get or create user in Supabase Auth using admin API
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    let user = usersData.users.find(u => u.email.toLowerCase() === formattedEmail);

    if (!user) {
      // Create user with a secure random password since this is passwordless OTP auth
      const securePassword = crypto.randomBytes(32).toString('hex');
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: formattedEmail,
        password: securePassword,
        email_confirm: true, // Auto-verifies the email!
        user_metadata: {
          full_name: name || formattedEmail.split('@')[0],
          name: name || formattedEmail.split('@')[0]
        }
      });

      if (createError) throw createError;
      user = newUser.user;
    } else {
      // If user exists, ensure they are confirmed
      if (!user.email_confirmed_at) {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
          email_confirm: true
        });
        if (updateError) throw updateError;
      }
    }

    // Generate a PKCE callback link / magic link for this session redirect
    const origin = req.headers.referer || req.headers.origin || 'http://localhost:5173';
    const cleanOrigin = origin.replace(/\/$/, '');
    const redirectTo = `${cleanOrigin}/auth/callback`;

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: formattedEmail,
      options: { redirectTo }
    });

    if (linkError) throw linkError;

    const actionLink = linkData.properties?.action_link;

    return res.status(200).json({
      success: true,
      message: 'Verification Successful',
      actionLink
    });
  } catch (err) {
    console.error('[TourNet Backend] Verify OTP failure:', err.message);
    return res.status(500).json({ success: false, error: err.message || 'Verification failed' });
  }
});

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Initialize local database JSON for reels
const reelsDbPath = path.join(uploadsDir, 'reels.json');
if (!fs.existsSync(reelsDbPath)) {
  fs.writeFileSync(reelsDbPath, JSON.stringify([], null, 2));
}

// Helper functions for reels database
function getReelsFromDb() {
  try {
    if (fs.existsSync(reelsDbPath)) {
      const data = fs.readFileSync(reelsDbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[TourNet Backend] Error reading reels.json:', err);
  }
  return [];
}

function saveReelsToDb(reels) {
  try {
    fs.writeFileSync(reelsDbPath, JSON.stringify(reels, null, 2));
  } catch (err) {
    console.error('[TourNet Backend] Error writing to reels.json:', err);
  }
}

// Custom multipart parser function
function parseMultipartData(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(.+)/);
  if (!boundaryMatch) return { fields: {}, files: {} };
  
  const boundary = '--' + boundaryMatch[1];
  const boundaryBuf = Buffer.from(boundary);
  const result = { fields: {}, files: {} };
  
  let index = buffer.indexOf(boundaryBuf);
  if (index === -1) return result;
  
  const parts = [];
  while (index !== -1) {
    const nextIndex = buffer.indexOf(boundaryBuf, index + boundaryBuf.length);
    if (nextIndex === -1) {
      parts.push(buffer.subarray(index + boundaryBuf.length));
      break;
    }
    parts.push(buffer.subarray(index + boundaryBuf.length, nextIndex));
    index = nextIndex;
  }
  
  for (const part of parts) {
    let workingPart = part;
    if (workingPart.startsWith('\r\n')) {
      workingPart = workingPart.subarray(2);
    } else if (workingPart.startsWith('\n')) {
      workingPart = workingPart.subarray(1);
    }
    
    const headersEnd = workingPart.indexOf('\r\n\r\n');
    if (headersEnd === -1) continue;
    
    const headersStr = workingPart.subarray(0, headersEnd).toString('utf8');
    
    let body = workingPart.subarray(headersEnd + 4);
    if (body.endsWith('\r\n')) {
      body = body.subarray(0, body.length - 2);
    } else if (body.endsWith('\n')) {
      body = body.subarray(0, body.length - 1);
    }
    
    const dispositionMatch = headersStr.match(/Content-Disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]+)")?/i);
    if (!dispositionMatch) continue;
    
    const name = dispositionMatch[1];
    const filename = dispositionMatch[2];
    
    if (filename) {
      const contentTypeMatch = headersStr.match(/Content-Type:\s*([^\r\n]+)/i);
      const mimeType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';
      result.files[name] = {
        filename,
        mimeType,
        data: body
      };
    } else {
      result.fields[name] = body.toString('utf8').trim();
    }
  }
  
  return result;
}

// Endpoint to fetch user reels
app.get('/api/reels', (req, res) => {
  try {
    const reels = getReelsFromDb();
    return res.status(200).json({ success: true, reels });
  } catch (err) {
    console.error('[TourNet Backend] Failed to fetch reels:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch reels' });
  }
});

// Endpoint to handle reel upload
app.post('/api/reels/upload', (req, res) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    try {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';
      
      const parsed = parseMultipartData(buffer, contentType);
      
      const videoFile = parsed.files['video'];
      if (!videoFile) {
        return res.status(400).json({ success: false, error: 'Video file is required' });
      }
      
      const videoExt = path.extname(videoFile.filename) || '.mp4';
      const videoUniqueName = `video-${Date.now()}-${Math.round(Math.random() * 1e9)}${videoExt}`;
      fs.writeFileSync(path.join(uploadsDir, videoUniqueName), videoFile.data);
      
      let thumbnailUniqueName = null;
      const thumbnailFile = parsed.files['thumbnail'];
      if (thumbnailFile) {
        const thumbExt = path.extname(thumbnailFile.filename) || '.jpg';
        thumbnailUniqueName = `thumb-${Date.now()}-${Math.round(Math.random() * 1e9)}${thumbExt}`;
        fs.writeFileSync(path.join(uploadsDir, thumbnailUniqueName), thumbnailFile.data);
      }
      
      const { category, title, description, location, hashtags } = parsed.fields;
      
      let parsedHashtags = [];
      if (hashtags) {
        try {
          parsedHashtags = JSON.parse(hashtags);
        } catch (e) {
          parsedHashtags = hashtags.split(',').map(tag => {
            const trimmed = tag.trim();
            return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
          });
        }
      }
      
      const newReel = {
        id: `server_${Date.now()}`,
        savedAt: Date.now(),
        category: category || 'spiritual',
        title: title || 'Untitled Reel',
        description: description || 'My travel reel on TourNet 🌏',
        location: location || 'Somewhere beautiful, India',
        hashtags: parsedHashtags.length ? parsedHashtags : ['#TourNet', '#Travel'],
        creator: { name: 'You', avatar: null, followers: '—', isVerified: false },
        stats: { likes: 0, comments: 0, shares: 0, saves: 0, views: 1 },
        duration: '—',
        distance: '—',
        weather: '—',
        season: '—',
        safety: 5.0,
        crowd: 'low',
        nearbyAttractions: [],
        accentColor: '#ff9933',
        bgPattern: category || 'spiritual',
        gradient: '',
        videoUrl: `/uploads/${videoUniqueName}`,
        thumbnailUrl: thumbnailUniqueName ? `/uploads/${thumbnailUniqueName}` : null
      };
      
      const reels = getReelsFromDb();
      reels.unshift(newReel);
      saveReelsToDb(reels);
      
      return res.status(200).json({ success: true, reel: newReel });
    } catch (err) {
      console.error('[TourNet Backend] Upload parsing failed:', err);
      return res.status(500).json({ success: false, error: err.message || 'Upload failed' });
    }
  });
});

// ── Start server + connect MongoDB ──────────────────────────────────────────
// connectDB() is called BEFORE listen() so routes have a live DB connection.
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 [TourNet] Server running  →  http://localhost:${port}`);
    console.log(`   Health:    http://localhost:${port}/api/health`);
  });
});

// ── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
