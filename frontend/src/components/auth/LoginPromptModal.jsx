import React, { useState, useEffect, useCallback } from 'react';

const DISMISS_KEY    = 'tournet_prompt_dismissed_at';
const REAPPEAR_MS    = 5 * 60 * 1000;  // Re-show after 5 minutes if dismissed
const TRIGGER_MS     = 30 * 1000;      // Show after 30 seconds of browsing

export default function LoginPromptModal({ onLogin, onSignup }) {
  const [visible, setVisible] = useState(false);
  const [animIn,  setAnimIn]  = useState(false);

  /* ── Decide whether to show ──────────────────────────────── */
  useEffect(() => {
    // Check if recently dismissed
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    const now = Date.now();

    if (now - dismissedAt < REAPPEAR_MS) return; // Still within cooldown

    const timer = setTimeout(() => {
      setVisible(true);
      // Slight delay so CSS transition fires after mount
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    }, TRIGGER_MS);

    return () => clearTimeout(timer);
  }, []);

  /* ── Dismiss ─────────────────────────────────────────────── */
  const dismiss = useCallback(() => {
    setAnimIn(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setTimeout(() => setVisible(false), 380);
  }, []);

  /* ── Close on Escape ─────────────────────────────────────── */
  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────── */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(2, 1, 8, 0.72)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: animIn ? 1 : 0,
          transition: 'opacity 0.38s ease',
        }}
      />

      {/* ── Modal card ────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to TourNet"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          // On md+ screens, center it like a floating card
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          pointerEvents: 'none',
          padding: '0 0 90px',   // above the BottomNav
        }}
      >
        <div
          style={{
            pointerEvents: 'all',
            width: '100%',
            maxWidth: 420,
            margin: '0 16px',
            background: 'rgba(7, 4, 18, 0.94)',
            backdropFilter: 'blur(36px) saturate(2)',
            WebkitBackdropFilter: 'blur(36px) saturate(2)',
            border: '1px solid rgba(255, 130, 30, 0.18)',
            borderRadius: 28,
            padding: '28px 24px 24px',
            boxShadow: `
              0 0 0 1px rgba(255,120,20,0.06),
              0 -4px 40px rgba(0,0,0,0.80),
              0 0 60px rgba(255,110,20,0.08),
              inset 0 1px 0 rgba(255,200,120,0.07)
            `,
            transform: animIn ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
            opacity: animIn ? 1 : 0,
            transition: 'transform 0.42s cubic-bezier(0.16,1,0.3,1), opacity 0.38s ease',
          }}
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Close"
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(200,175,150,0.70)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(200,175,150,0.70)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
          </button>

          {/* Top icon + live dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16, flexShrink: 0,
              background: 'linear-gradient(135deg, #e05a00, #ff9933)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 22px rgba(255,130,30,0.50)',
              position: 'relative',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 26, color: '#1a0600', fontVariationSettings: "'FILL' 1" }}>explore</span>
              {/* Live pulse dot */}
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 10, height: 10, borderRadius: '50%',
                background: '#4dff88',
                boxShadow: '0 0 8px rgba(77,255,136,0.9)',
                border: '2px solid #07041a',
                animation: 'pulseSlow 2s ease-in-out infinite',
              }} />
            </div>
            <div>
              <p style={{
                fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'rgba(255,160,70,0.80)',
                margin: '0 0 2px',
              }}>
                TourNet Community
              </p>
              <p style={{
                fontSize: 10, color: 'rgba(180,155,130,0.55)',
                fontWeight: 600, margin: 0,
              }}>
                1,000+ explorers online now
              </p>
            </div>
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em',
            color: '#fff', margin: '0 0 8px', lineHeight: 1.2,
            fontFamily: "'Inter', sans-serif",
          }}>
            Unlock Your Full{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ff8c00 0%, #ffcc44 50%, #ff6600 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              India Journey
            </span>
          </h2>

          {/* Benefits list */}
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: 'map',           text: 'Save & plan personalised trip routes' },
              { icon: 'gpp_good',      text: 'Live crowd safety scores & SOS alerts' },
              { icon: 'notifications', text: 'Real-time Aarti & event reminders'    },
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(255,130,30,0.12)',
                  border: '1px solid rgba(255,130,30,0.16)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#ff9933', fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </span>
                <span style={{ fontSize: 12, color: 'rgba(210,185,160,0.85)', fontWeight: 500, lineHeight: 1.4 }}>{item.text}</span>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {/* Sign Up — primary */}
            <button
              id="prompt-signup-btn"
              onClick={() => { dismiss(); onSignup(); }}
              style={{
                flex: 1,
                padding: '13px 8px',
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(135deg, #e85d00 0%, #ff8c00 45%, #ffaa22 80%, #e07000 100%)',
                color: '#1a0600',
                fontSize: 13, fontWeight: 800,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 0 24px rgba(255,130,20,0.48), 0 4px 16px rgba(230,90,0,0.35), inset 0 1px 0 rgba(255,220,150,0.22)',
                transition: 'all 0.28s cubic-bezier(0.16,1,0.3,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(255,140,30,0.70), 0 8px 24px rgba(230,90,0,0.50)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(255,130,20,0.48), 0 4px 16px rgba(230,90,0,0.35), inset 0 1px 0 rgba(255,220,150,0.22)'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>rocket_launch</span>
              Join Free
            </button>

            {/* Login — secondary */}
            <button
              id="prompt-login-btn"
              onClick={() => { dismiss(); onLogin(); }}
              style={{
                flex: 1,
                padding: '13px 8px',
                borderRadius: 14,
                border: '1px solid rgba(255,130,30,0.24)',
                background: 'rgba(255,120,20,0.08)',
                color: 'rgba(255,180,100,0.92)',
                fontSize: 13, fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.25s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,130,30,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,150,50,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,120,20,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,130,30,0.24)'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>login</span>
              Sign In
            </button>
          </div>

          {/* Dismiss footnote */}
          <p style={{
            textAlign: 'center', marginTop: 14, marginBottom: 0,
            fontSize: 10, color: 'rgba(160,135,110,0.45)',
            fontWeight: 600, letterSpacing: '0.04em',
          }}>
            No spam · Free forever · Cancel anytime
          </p>
        </div>
      </div>
    </>
  );
}
