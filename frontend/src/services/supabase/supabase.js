/**
 * supabase.js — TourNet Supabase Client
 *
 * OAuth Redirect Flow (Google):
 *   1. User clicks "Continue with Google"
 *   2. Supabase redirects to Google's consent page
 *   3. Google redirects to:  https://<project>.supabase.co/auth/v1/callback
 *   4. Supabase processes the Google token, then redirects to your app:
 *        http://localhost:5173/auth/callback?code=xxx  (PKCE)
 *   5. This client detects the `code` param (detectSessionInUrl: true)
 *      and automatically exchanges it for a Supabase session.
 *   6. onAuthStateChange fires with SIGNED_IN → user is logged in.
 *
 * Required Supabase Dashboard settings:
 *   Authentication → URL Configuration → Redirect URLs:
 *     http://localhost:5173/**
 *     https://yourdomain.com/**
 *
 * Required Google Cloud Console settings:
 *   Authorized redirect URIs:
 *     https://<project-id>.supabase.co/auth/v1/callback
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* ── Configuration guard ───────────────────────────────────────────────── */
// Placeholder / demo URLs that indicate real credentials haven't been set
const PLACEHOLDER_URLS = ['tournet-project-xyz', 'placeholder', 'localhost', 'example'];

export const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://') &&
  !PLACEHOLDER_URLS.some(p => supabaseUrl.includes(p)) &&
  !supabaseKey.includes('placeholder')
);

// isMockSandbox: real Supabase project but we want to intercept calls with mock data
// (Only applies if a genuinely-looking but known-test URL is detected)
export const isMockSandbox = !isConfigured && Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('https://')
);

const throwDevError = () => {
  const errorMsg = 'Auth service is not yet configured. Please add your real VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the .env file to enable sign-in.';
  console.warn('[TourNet]', errorMsg);
  throw new Error(errorMsg);
};

let supabaseClient;

if (isConfigured && !isMockSandbox) {
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken:   true,
      persistSession:     true,
      detectSessionInUrl: true,  // Auto-exchanges OAuth code → session on load
    },
  });
} else if (isMockSandbox) {
  // Mock Sandbox Client to prevent calling dead/dummy URLs
  const dummyClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken:   false,
      persistSession:     false,
      detectSessionInUrl: false,
    },
  });

  const authMock = {
    async getSession() {
      const data = localStorage.getItem('tournet_mock_session');
      const session = data ? JSON.parse(data) : null;
      return { data: { session }, error: null };
    },
    onAuthStateChange(callback) {
      const data = localStorage.getItem('tournet_mock_session');
      const session = data ? JSON.parse(data) : null;
      
      // Fire initial state
      callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      
      // Return unsubscribe
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    async signOut() {
      localStorage.removeItem('tournet_mock_session');
      return { error: null };
    }
  };

  supabaseClient = new Proxy(dummyClient, {
    get(target, prop) {
      if (prop === 'auth') {
        return authMock;
      }
      if (prop === 'from') {
        return (tableName) => {
          return {
            select: () => ({
              eq: () => ({
                single: async () => {
                  if (tableName === 'profiles') {
                    const sessionData = localStorage.getItem('tournet_mock_session');
                    const user = sessionData ? JSON.parse(sessionData).user : null;
                    if (user) {
                      return {
                        data: {
                          id: user.id,
                          full_name: user.user_metadata.full_name,
                          name: user.user_metadata.name,
                          email: user.email,
                          avatar_url: user.user_metadata.avatar_url,
                          provider: 'google',
                          tier: 'Explorer',
                          preferences: {},
                          stats: { trips: 3, safetyXP: 450, reviews: 12 },
                          created_at: new Date().toISOString()
                        },
                        error: null
                      };
                    }
                  }
                  return { data: null, error: null };
                },
                order: () => ({
                  limit: async () => ({ data: [], error: null })
                })
              })
            }),
            upsert: (data) => ({
              select: () => ({
                single: async () => ({ data, error: null })
              })
            }),
            update: (data) => ({
              eq: () => ({
                select: () => ({
                  single: async () => ({ data, error: null })
                })
              })
            })
          };
        };
      }
      return Reflect.get(target, prop);
    }
  });
} else {
  // Use a proxy client wrapper to prevent app crash at load/mount time, but throw a developer error on action attempts.
  supabaseClient = new Proxy({}, {
    get(target, prop) {
      if (prop === 'auth') {
        return new Proxy({}, {
          get(t, p) {
            if (p === 'getSession') {
              return async () => ({ data: { session: null }, error: null });
            }
            if (p === 'onAuthStateChange') {
              return () => ({ data: { subscription: { unsubscribe: () => {} } } });
            }
            return () => throwDevError();
          }
        });
      }
      if (prop === 'from') {
        return () => {
          const handler = {
            get(targetChain, propChain) {
              if (propChain === 'then' || propChain === 'catch') {
                return (resolve, reject) => {
                  try {
                    throwDevError();
                  } catch (e) {
                    if (reject) reject(e);
                    else throw e;
                  }
                };
              }
              return new Proxy(() => {}, handler);
            }
          };
          return new Proxy(() => {}, handler);
        };
      }
      return () => throwDevError();
    }
  });
}

export const supabase = supabaseClient;

/* ── OAuth redirect helpers ────────────────────────────────────────────── */

/**
 * The URL Supabase (and Google) will redirect back to after OAuth.
 * In production, replace with your real domain.
 */
export const OAUTH_REDIRECT_URL = `${window.location.origin}/auth/callback`;

/**
 * Returns true if the current URL contains an OAuth response
 * (either a PKCE `code` param or a hash with `access_token`).
 */
export function isOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const hash   = window.location.hash;
  return (
    params.has('code') ||
    params.has('error_description') ||
    hash.includes('access_token') ||
    hash.includes('error=')
  );
}

/**
 * Strips auth-related params from the browser URL bar
 * so users don't see ugly `?code=xxx` after sign-in.
 */
export function cleanOAuthUrl() {
  if (isOAuthCallback()) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}
