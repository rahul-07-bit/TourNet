import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Expeditions from './components/Expeditions';
import Reels from './components/Reels';
import CrowdMap from './components/CrowdMap';
import SafetyHub from './components/SafetyHub';
import Analytics from './components/Analytics';
import Contact from './components/Contact';
import FAB from './components/FAB';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <>
      <Header />
      <main className="pb-32">
        <Hero />
        <Dashboard />
        <Expeditions />
        <Reels />
        <CrowdMap />
        <SafetyHub />
        <Analytics />
        <Contact />
      </main>
      <FAB />
      <BottomNav />
    </>
  );
}

export default App;
