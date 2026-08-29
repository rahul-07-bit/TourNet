import React, { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex flex-col"
      style={{
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
      }}
    >
      {/* Main navbar row */}
      <div
        className="flex justify-between items-center px-6 py-3.5"
        style={{
          background: scrolled
            ? 'rgba(6, 4, 14, 0.88)'
            : 'linear-gradient(to bottom, rgba(4,2,12,0.75) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(28px) saturate(1.8)' : 'blur(10px)',
          WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(1.8)' : 'blur(10px)',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Left: Search */}
        <button
          id="nav-search-btn"
          aria-label="Search destinations"
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            border: '1px solid rgba(255,140,40,0.15)',
            background: 'rgba(255,120,30,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            color: 'rgba(255,180,100,0.85)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,130,30,0.18)';
            e.currentTarget.style.borderColor = 'rgba(255,150,50,0.40)';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(255,130,30,0.25)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,120,30,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,140,40,0.15)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
        </button>

        {/* Center: Logo */}
        <h1
          className="logo-text"
          style={{ fontSize: 22, letterSpacing: '0.28em', lineHeight: 1 }}
        >
          TOURNET
        </h1>

        {/* Right: Notification bell */}
        <button
          id="nav-notification-btn"
          aria-label="Notifications"
          style={{
            width: 40, height: 40,
            borderRadius: '50%',
            border: '1px solid rgba(255,140,40,0.15)',
            background: 'rgba(255,120,30,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            color: 'rgba(255,180,100,0.85)',
            position: 'relative',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,130,30,0.18)';
            e.currentTarget.style.borderColor = 'rgba(255,150,50,0.40)';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(255,130,30,0.25)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,120,30,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,140,40,0.15)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
          {/* Live indicator dot */}
          <span style={{
            position: 'absolute', top: 7, right: 7,
            width: 7, height: 7,
            borderRadius: '50%',
            background: '#ff6b2b',
            boxShadow: '0 0 6px rgba(255,107,43,0.9)',
          }} />
        </button>
      </div>

      {/* Orange glowing divider line */}
      <div className="divider-glow" />
    </header>
  );
}
