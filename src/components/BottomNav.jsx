import React from 'react';

const NAV_ITEMS = [
  { id: 'home',    icon: 'home',           label: 'Home'    },
  { id: 'explore', icon: 'explore',        label: 'Explore' },
  { id: 'reels',   icon: 'movie',          label: 'Reels'   },
  { id: 'safety',  icon: 'gpp_maybe',      label: 'Safety'  },
  { id: 'profile', icon: 'account_circle', label: 'Profile' },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 8px 14px',
        background: 'rgba(5, 3, 12, 0.84)',
        backdropFilter: 'blur(36px) saturate(2.2)',
        WebkitBackdropFilter: 'blur(36px) saturate(2.2)',
        borderTop: '1px solid rgba(255, 140, 40, 0.10)',
        boxShadow: '0 -12px 40px rgba(0,0,0,0.70), 0 -1px 0 rgba(255,130,30,0.06)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-${item.id}-btn`}
            aria-label={item.label}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '8px 14px',
              borderRadius: 14,
              border: 'none',
              background: isActive
                ? 'rgba(255, 130, 30, 0.14)'
                : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isActive
                ? '0 0 18px rgba(255, 120, 30, 0.25)'
                : 'none',
              transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
              minWidth: 52,
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,120,30,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 24,
                color: isActive ? '#ff9933' : 'rgba(180, 150, 120, 0.65)',
                filter: isActive ? 'drop-shadow(0 0 8px rgba(255,153,51,0.70))' : 'none',
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                transition: 'all 0.3s ease',
                animation: isActive ? 'navItemGlow 3s ease-in-out infinite' : 'none',
              }}
            >
              {item.icon}
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              letterSpacing: '0.04em',
              color: isActive ? 'rgba(255,180,100,0.95)' : 'rgba(160,135,110,0.60)',
              transition: 'color 0.3s ease',
              textTransform: 'uppercase',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
