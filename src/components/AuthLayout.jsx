/**
 * AuthLayout.jsx
 *
 * Shared layout wrapper for all authentication pages (Login, Signup,
 * Forgot Password). Provides the dark background, centred card column,
 * and decorative ambient orbs so each page doesn't need to repeat them.
 *
 * Usage:
 *   <AuthLayout>
 *     <LoginPage />
 *   </AuthLayout>
 */

import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div
      id="auth-layout"
      style={{
        minHeight: '100dvh',
        background: '#05030e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow orbs */}
      <div style={{
        position: 'fixed', top: '-15%', left: '-10%',
        width: 480, height: 480, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(255,100,10,0.17) 0%, transparent 65%)',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%',
        width: 520, height: 520, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(180,50,200,0.09) 0%, transparent 65%)',
      }} />

      {/* Dot grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,130,30,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Brand watermark */}
      <div style={{
        position: 'fixed', top: 22, left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, pointerEvents: 'none',
        fontSize: 13, fontWeight: 900, letterSpacing: '0.35em',
        background: 'linear-gradient(135deg, #ff9933, #ffcc66, #ff8800)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        filter: 'drop-shadow(0 0 10px rgba(255,160,40,0.45))',
      }}>
        TOURNET
      </div>

      {/* Page content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440 }}>
        {children}
      </div>
    </div>
  );
}
