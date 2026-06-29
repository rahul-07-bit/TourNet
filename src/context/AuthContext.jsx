/**
 * AuthContext.jsx — TourNet Authentication System
 *
 * Provides:
 *  - Passwordless Email OTP Authentication (Gmail OTP using Supabase)
 *  - Intercepted Google OAuth + Gmail OTP Verification flow
 *  - Session persistence (survives refresh via Supabase or localStorage in sandbox mode)
 *  - Automatic profile creation in `profiles` table / localStorage
 *  - Guest data merge on first login
 *  - Human-friendly error messages for every Supabase/network failure
 */

import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from 'react';
import { supabase, isConfigured, isMockSandbox, OAUTH_REDIRECT_URL, cleanOAuthUrl } from '../lib/supabase';
import { getProfile, upsertProfile, updateProfile, mergeGuestData } from '../lib/userService';

/* ─────────────────────────────────────────────────────────────
   Context
   ───────────────────────────────────────────────────────────── */
const AuthContext = createContext(null);

/* ─────────────────────────────────────────────────────────────
   OTP client-side rate limiter
   Cooldown set to 60 seconds (60_000ms) as per requirements.
   ───────────────────────────────────────────────────────────── */
const OTP_KEY         = 'tournet_otp_last_sent';
const OTP_COOLDOWN_MS = 60_000;

function getLastOtpSent()  { return Number(localStorage.getItem(OTP_KEY) || 0); }
function markOtpSent()     { localStorage.setItem(OTP_KEY, String(Date.now())); }
function otpCooldownLeft() {
  const elapsed = Date.now() - getLastOtpSent();
  return elapsed < OTP_COOLDOWN_MS ? Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000) : 0;
}

/* ─────────────────────────────────────────────────────────────
   Error normalizer
   Maps raw Supabase/network errors → user-friendly messages.
   ───────────────────────────────────────────────────────────── */
function normalizeError(err) {
  if (!err) return 'An unexpected error occurred.';

  // Network / fetch failures
  if (
    err instanceof TypeError ||
    (typeof err.message === 'string' && (
      err.message.includes('Failed to fetch') ||
      err.message.includes('fetch failed') ||
      err.message.includes('NetworkError') ||
      err.message.includes('network error') ||
      err.message.includes('ECONNREFUSED')
    ))
  ) {
    return 'Network error — please check your internet connection and try again.';
  }

  const msg = (err.message || '').toLowerCase();

  // Strict OTP verification mappings required by spec
  if (msg.includes('expired') && (msg.includes('otp') || msg.includes('token') || msg.includes('code') || msg.includes('grant'))) {
    return 'OTP expired. Request a new OTP.';
  }
  if (msg.includes('invalid') || msg.includes('incorrect') || msg.includes('token') || msg.includes('code') || msg.includes('grant')) {
    return 'Invalid OTP. Please try again.';
  }

  if (
    msg.includes('rate limit') ||
    msg.includes('too many requests') ||
    msg.includes('over_email_send_rate_limit') ||
    msg.includes('429')
  ) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  if (msg.includes('jwt expired') || msg.includes('session_expired')) {
    return 'Your session has expired. Please sign in again.';
  }
  if (msg.includes('oauth') || msg.includes('provider')) {
    return 'Google sign-in failed. Please try again or use Gmail OTP.';
  }

  return err.message || 'An unexpected error occurred. Please try again.';
}

/* ─────────────────────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────────────────────── */
export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [profile,   setProfile]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const mergedRef = useRef(false);

  /* ── Load / create profile row ─────────────────────────────── */
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) return null;
    try {
      let prof = await getProfile(authUser.id);
      // First OAuth login or OTP signup may arrive before DB trigger
      if (!prof) {
        prof = await upsertProfile(authUser.id, {
          name:       authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          full_name:  authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          email:      authUser.email,
          avatar_url: authUser.user_metadata?.avatar_url ?? null,
          provider:   authUser.app_metadata?.provider ?? 'email',
          created_at: new Date().toISOString(),
        });
      }
      setProfile(prof);
      return prof;
    } catch (err) {
      console.warn('[TourNet] Profile load failed:', err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    // Restore existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) loadProfile(authUser);
      setIsLoading(false);
      setAuthReady(true);
    });

    // React to login / logout / token refresh / OAuth redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const authUser = session?.user ?? null;

        if (authUser) {
          // Check if Google OAuth login needs OTP verification
          const isGoogle = authUser.app_metadata?.provider === 'google';
          const otpVerified = sessionStorage.getItem('tournet_google_otp_verified') === 'true';

          if (isGoogle && !otpVerified && !isMockSandbox) {
            const email = authUser.email;
            const name = authUser.user_metadata?.full_name || authUser.user_metadata?.name || email.split('@')[0];

            sessionStorage.setItem('tournet_google_pending_email', email);
            sessionStorage.setItem('tournet_google_pending_name', name);
            sessionStorage.setItem('tournet_google_otp_triggered', 'true');

            // Immediately sign out to clear active session and prevent unauthorized access
            await supabase.auth.signOut();

            // Refresh client to clear URL params and trigger UI OTP verification view
            window.location.reload();
            return;
          }

          const prof = await loadProfile(authUser);
          setUser(authUser);
          if (!mergedRef.current && prof) {
            mergedRef.current = true;
            await mergeGuestData(authUser.id, prof);
          }
          if (event === 'SIGNED_IN') cleanOAuthUrl();
        } else {
          setUser(null);
          setProfile(null);
          mergedRef.current = false;
        }

        setIsLoading(false);
        setAuthReady(true);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  /* ═══════════════════════════════════════════════════════════
     OTP AUTH ACTIONS
     ═══════════════════════════════════════════════════════════ */

  /** Send secure 6-digit OTP to user email using our backend API */
  const sendOtp = useCallback(async (email, name = '') => {
    const cooldown = otpCooldownLeft();
    if (cooldown > 0) {
      throw new Error(`Please wait ${cooldown}s before resending.`);
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      markOtpSent();
    } catch (err) {
      throw new Error(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Verify exact 6-digit OTP using our backend API */
  const verifyOtp = useCallback(async (email, token, name = '') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: token.trim(), name: name.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        // Return raw error message from backend or default to standard message
        throw new Error(data.error || 'Verification failed');
      }

      // If validation succeeds, backend returns actionLink to log the user in via Supabase redirect
      if (data.actionLink) {
        window.location.href = data.actionLink;
      } else {
        throw new Error('Verification succeeded but session link was missing');
      }
    } catch (err) {
      throw err; // propagates the exact backend error (e.g. OTP Expired, Invalid OTP)
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Google OAuth redirect handler */
  const loginWithGoogle = useCallback(async () => {
    if (!isConfigured) {
      const errorMsg = "Developer Error: Supabase URL or Anon Key is missing or contains 'placeholder'. Please set valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    setIsLoading(true);
    try {
      if (isMockSandbox) {
        // Mock login - store mock session in localStorage and redirect
        const mockSession = {
          access_token: 'mock-google-token',
          refresh_token: 'mock-google-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: 'mock-google-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'rahul.sharma@example.com',
            email_confirmed_at: new Date().toISOString(),
            app_metadata: { provider: 'google' },
            user_metadata: {
              full_name: 'Rahul Sharma',
              name: 'Rahul Sharma',
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
            },
          },
        };
        localStorage.setItem('tournet_mock_session', JSON.stringify(mockSession));
        
        // Redirect to /auth/callback
        setTimeout(() => {
          window.location.href = window.location.origin + '/auth/callback?code=mock-google-oauth-code';
        }, 1000);
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback',
        },
      });
      if (error) throw new Error(normalizeError(error));
    } finally {
      if (!isMockSandbox) {
        setIsLoading(false);
      }
    }
  }, []);

  /** Sign out and clear Google OTP security tokens */
  const logout = useCallback(async () => {
    sessionStorage.removeItem('tournet_google_otp_verified');
    sessionStorage.removeItem('tournet_google_pending_email');
    sessionStorage.removeItem('tournet_google_pending_name');
    sessionStorage.removeItem('tournet_google_otp_triggered');
    
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    mergedRef.current = false;
  }, []);

  /** Re-fetch profile */
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const prof = await getProfile(user.id);
    setProfile(prof);
    return prof;
  }, [user]);

  const getOtpCooldown = useCallback(() => otpCooldownLeft(), []);

  /* ── Context value ─────────────────────────────────────────── */
  return (
    <AuthContext.Provider value={{
      // State
      user, profile, isLoading, authReady, isConfigured,
      // Actions
      sendOtp, verifyOtp,
      loginWithGoogle, logout, refreshProfile, getOtpCooldown,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
