import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Format join date from profile
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'Explorer';

  // Get initials for avatar fallback
  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'UN';

  return (
    <section
      className="animate-fade-in-up pb-28 pt-6"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      {/* Background glow decorations */}
      <div style={{
        position: 'fixed', top: '25%', left: '33%',
        width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(140,50,220,0.10) 0%, transparent 65%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        filter: 'blur(20px)',
      }} />
      <div style={{
        position: 'fixed', bottom: '25%', right: '25%',
        width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(255,130,30,0.08) 0%, transparent 65%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        filter: 'blur(20px)',
      }} />

      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: 480,
        margin: '0 auto',
        padding: '0 20px',
      }}>

        {/* ── User Hero Card ──────────────────────────────────── */}
        <div style={{
          background: 'rgba(8,5,20,0.80)',
          backdropFilter: 'blur(28px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
          border: '1px solid rgba(255,130,30,0.12)',
          borderRadius: 28,
          padding: '32px 24px',
          textAlign: 'center',
          marginBottom: 16,
          boxShadow: '0 16px 60px rgba(0,0,0,0.70), inset 0 1px 0 rgba(255,200,120,0.05)',
        }}>
          {/* Avatar */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            <div style={{
              position: 'absolute', inset: -3,
              background: 'linear-gradient(135deg, #ff8c00, #ffcc44, #ff6600)',
              borderRadius: '50%',
              filter: 'blur(4px)',
              opacity: 0.7,
              animation: 'pulseSlow 4s ease-in-out infinite',
            }} />
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                style={{
                  position: 'relative',
                  width: 96, height: 96, borderRadius: '50%',
                  border: '3px solid #05030e',
                  objectFit: 'cover',
                  background: '#1a0a00',
                }}
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            {/* Initials fallback */}
            <div style={{
              position: 'relative',
              width: 96, height: 96, borderRadius: '50%',
              border: '3px solid #05030e',
              background: 'linear-gradient(135deg, #1a0600, #2a1000)',
              display: profile?.avatar_url ? 'none' : 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 900,
              color: '#ff9933',
              fontFamily: "'Inter', sans-serif",
            }}>
              {initials}
            </div>
          </div>

          <h2 style={{
            fontSize: 22, fontWeight: 900, color: '#fff',
            letterSpacing: '-0.02em', margin: '0 0 4px',
          }}>
            {profile?.name || 'Explorer'}
          </h2>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', margin: '0 0 4px',
            background: 'linear-gradient(135deg, #ff9933, #ffcc66)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {profile?.tier || 'Explorer'} Tier
          </p>
          <p style={{ fontSize: 12, color: 'rgba(190,165,140,0.70)', margin: '0 0 8px' }}>
            {user?.email}
          </p>
          <p style={{
            fontSize: 11, color: 'rgba(160,140,120,0.55)',
            fontWeight: 600, letterSpacing: '0.06em',
          }}>
            Member since {joinDate}
          </p>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0, marginTop: 24, paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            {[
              { value: profile?.stats?.trips || 0,      label: 'Trips',       color: '#fff'     },
              { value: profile?.stats?.safetyXP || 0,   label: 'Safety XP',   color: '#ff9933'  },
              { value: profile?.stats?.reviews || 0,    label: 'Reviews',     color: '#22ccee'  },
            ].map((stat, i) => (
              <div key={i} style={{
                textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <p style={{ fontSize: 22, fontWeight: 900, color: stat.color, margin: 0, lineHeight: 1.2 }}>
                  {typeof stat.value === 'number' && stat.value > 999 ? `${(stat.value/1000).toFixed(1)}k` : stat.value}
                </p>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(180,155,130,0.60)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tier Progress ───────────────────────────────────── */}
        <div style={{
          background: 'rgba(8,5,18,0.75)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,130,30,0.10)',
          borderRadius: 20,
          padding: '18px 20px',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(200,175,145,0.85)' }}>Explorer Progress</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#ff9933' }}>New Member</span>
          </div>
          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: '8%', height: '100%',
              background: 'linear-gradient(90deg, #e85d00, #ffaa22)',
              boxShadow: '0 0 10px rgba(255,153,51,0.6)',
              borderRadius: 3,
              transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
          <p style={{ fontSize: 10, color: 'rgba(180,155,130,0.55)', marginTop: 8 }}>
            Complete your first trip to unlock Gold Explorer status.
          </p>
        </div>

        {/* ── Badges ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(180,155,130,0.55)', textTransform: 'uppercase', marginBottom: 12 }}>
            Unlocked Badges
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { icon: 'rocket_launch', label: 'Pioneer', sub: 'First sign-up!', color: '#ff9933' },
              { icon: 'explore',       label: 'Curious',  sub: 'Explored app',   color: '#22ccee' },
              { icon: 'lock',          label: 'Secured',  sub: 'Account safe',   color: '#88dd22' },
            ].map((b, i) => (
              <div key={i} style={{
                background: 'rgba(8,5,18,0.75)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,130,30,0.08)',
                borderRadius: 18,
                padding: '16px 8px',
                textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28, color: b.color, marginBottom: 8, fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{b.label}</p>
                <p style={{ fontSize: 9, color: 'rgba(180,155,130,0.55)', margin: 0 }}>{b.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Account Settings ────────────────────────────────── */}
        <div style={{
          background: 'rgba(8,5,18,0.75)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: '1px solid rgba(255,130,30,0.08)',
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(180,155,130,0.55)', textTransform: 'uppercase', padding: '16px 20px 8px' }}>
            Account
          </p>
          {[
            { icon: 'person', label: 'Edit Profile',         sub: 'Update your information'  },
            { icon: 'notifications', label: 'Notifications',  sub: 'Manage alerts & updates' },
            { icon: 'shield',        label: 'Privacy & Safety', sub: 'Control your data'     },
            { icon: 'help',          label: 'Help & Support',   sub: '24/7 concierge access' },
          ].map((item, i, arr) => (
            <button
              key={i}
              onClick={() => {}}
              style={{
                width: '100%', padding: '14px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'none', border: 'none',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.2s ease',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,130,30,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,130,30,0.10)',
                border: '1px solid rgba(255,130,30,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(255,160,80,0.85)' }}>{item.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: 10, color: 'rgba(180,155,130,0.60)', margin: 0 }}>{item.sub}</p>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(180,155,130,0.40)' }}>chevron_right</span>
            </button>
          ))}
        </div>

        {/* ── Logout button ───────────────────────────────────── */}
        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              width: '100%', padding: '14px',
              borderRadius: 16,
              border: '1px solid rgba(255,80,80,0.20)',
              background: 'rgba(255,50,50,0.06)',
              color: 'rgba(255,120,120,0.90)',
              fontSize: 13, fontWeight: 800,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.25s ease',
              marginBottom: 16,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,60,60,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.40)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,50,50,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,80,80,0.20)'; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            Sign Out
          </button>
        ) : (
          <div style={{
            background: 'rgba(255,50,50,0.08)',
            border: '1px solid rgba(255,80,80,0.22)',
            borderRadius: 16, padding: '18px 20px',
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,140,140,0.95)', margin: '0 0 14px', textAlign: 'center' }}>
              Are you sure you want to sign out?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1, padding: '11px',
                  borderRadius: 12, border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(200,180,160,0.80)',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={logout}
                style={{
                  flex: 1, padding: '11px',
                  borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #c0100a, #ff3333)',
                  color: '#fff', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                  boxShadow: '0 0 16px rgba(255,50,50,0.40)',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* App version */}
        <p style={{
          textAlign: 'center', fontSize: 10,
          color: 'rgba(160,135,110,0.40)',
          fontWeight: 600, letterSpacing: '0.06em',
          paddingBottom: 8,
        }}>
          TOURNET v1.0.0 • India Edition 🇮🇳
        </p>
      </div>
    </section>
  );
}
