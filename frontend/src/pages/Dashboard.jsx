import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SafetyHub from '../components/SafetyHub';
import Profile from '../components/Profile';
import BottomNav from '../components/BottomNav';
import Explore from '../components/Explore';
import CinematicBackground from '../components/CinematicBackground';
import ReelsSection from '../components/reels/ReelsSection';

const TAB_PATHS = {
  home: '/',
  explore: '/explore',
  reels: '/reels',
  safety: '/safety',
  profile: '/profile',
};

const PATH_TABS = Object.entries(TAB_PATHS).reduce((tabs, [tab, path]) => {
  tabs[path] = tab;
  return tabs;
}, {});

function tabFromPath() {
  return PATH_TABS[window.location.pathname] || 'home';
}

export default function Dashboard() {
  const [activeTab, setActiveTabState] = useState(tabFromPath);

  useEffect(() => {
    const handlePopState = () => setActiveTabState(tabFromPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActiveTab = (tab) => {
    const nextPath = TAB_PATHS[tab] || TAB_PATHS.home;
    setActiveTabState(tab);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Hero setActiveTab={setActiveTab} />;
      case 'explore': return <div style={{ paddingTop: 8 }}><Explore /></div>;
      case 'reels': return <div style={{ paddingTop: 56 }}><ReelsSection /></div>;
      case 'safety': return <div style={{ paddingTop: 72 }}><SafetyHub /></div>;
      case 'profile': return <Profile />;
      default: return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <div>
        {activeTab === 'home' && <CinematicBackground />}
        <Header />
        <main style={{ position: 'relative', zIndex: 10, paddingBottom: 76 }}>
          {renderContent()}
        </main>
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}
