/**
 * ProtectedRoute.jsx
 *
 * Wraps any component that requires an authenticated user.
 * While the session is being resolved (`!authReady`) it renders a
 * full-screen loading spinner so there is no layout flash.
 * Once resolved, unauthenticated visitors are redirected to the
 * auth gate (the `fallback` prop or null by default).
 *
 * Usage:
 *   <ProtectedRoute fallback={<AuthPage />}>
 *     <Dashboard />
 *   </ProtectedRoute>
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

/* ── Full-screen skeleton while session loads ──────────────────── */
function AuthLoadingScreen() {
  return (
    <div id="auth-loading-screen" style={{
      minHeight: '100dvh',
      background: '#05030e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Pulsing brand logo */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, #e05a00, #ff9933)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px rgba(255,130,30,0.50)',
        animation: 'prPulse 2s ease-in-out infinite',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#1a0600', fontVariationSettings: "'FILL' 1" }}>
          explore
        </span>
      </div>

      {/* Spinner */}
      <span className="material-symbols-outlined" style={{
        fontSize: 28, color: 'rgba(255,130,30,0.70)',
        animation: 'prSpin 0.9s linear infinite',
      }}>
        progress_activity
      </span>

      <p style={{ fontSize: 13, color: 'rgba(190,165,140,0.60)', fontWeight: 600, letterSpacing: '0.06em', margin: 0 }}>
        Restoring your session…
      </p>

      <style>{`
        @keyframes prPulse { 0%,100%{box-shadow:0 0 40px rgba(255,130,30,0.50)} 50%{box-shadow:0 0 60px rgba(255,130,30,0.80)} }
        @keyframes prSpin  { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

/* ── ProtectedRoute ────────────────────────────────────────────── */
export default function ProtectedRoute({ children, fallback = null }) {
  const { user, authReady } = useAuth();

  // Still resolving the initial session — avoid flash of wrong content
  if (!authReady) return <AuthLoadingScreen />;

  // Not logged in — show the fallback (e.g. <AuthPage />) or nothing
  if (!user) return fallback;

  // Authenticated — render children as-is
  return children;
}
