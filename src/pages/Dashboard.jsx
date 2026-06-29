/**
 * pages/Dashboard.jsx
 *
 * The authenticated main dashboard.
 * Wraps the tab-based MainApp shell. When a router is added later,
 * this page can be placed at the `/dashboard` or `/app` route inside
 * a <ProtectedRoute> element.
 *
 * Current architecture: rendered directly by App.jsx → AppGate when
 * user is authenticated.
 *
 * Reels tab → full-screen immersive ReelsPage (fixed overlay, no header/padding)
 */

import React, { useState, useEffect } from 'react';
import Header              from '../components/Header';
import Hero                from '../components/Hero';
import ReelsPage           from '../components/Reels/index.jsx';
import SafetyHub           from '../components/SafetyHub';
import Profile             from '../components/Profile';
import BottomNav           from '../components/BottomNav';
import Explore             from '../components/Explore';
import CinematicBackground from '../components/CinematicBackground';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');

  // Scroll to top on tab change (not relevant for full-screen Reels, but
  // keeps behaviour consistent for other tabs).
  useEffect(() => {
    if (activeTab !== 'reels') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab]);

  // Lock body scroll while Reels is active so the parent page doesn't
  // scroll underneath the fixed overlay.
  useEffect(() => {
    if (activeTab === 'reels') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':    return <Hero setActiveTab={setActiveTab} />;
      case 'explore': return <div style={{ paddingTop: 8 }}><Explore /></div>;
      case 'safety':  return <div style={{ paddingTop: 72 }}><SafetyHub /></div>;
      case 'profile': return <Profile />;
      default:        return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      {/* ── Full-screen Reels overlay (no header, no bottom padding) ── */}
      {activeTab === 'reels' && (
        <ReelsPage />
      )}

      {/* ── Regular shell (hidden while Reels is active) ── */}
      <div style={{ display: activeTab === 'reels' ? 'none' : 'block' }}>
        {activeTab === 'home' && <CinematicBackground />}
        <Header />
        <main style={{ position: 'relative', zIndex: 10, paddingBottom: 76 }}>
          {renderContent()}
        </main>
      </div>

      {/* ── Bottom nav always visible ── */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

