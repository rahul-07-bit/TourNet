import React from 'react';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-surface/40 backdrop-blur-2xl rounded-t-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col items-center justify-center bg-primary-container/20 text-primary rounded-xl p-2 shadow-[0_0_15px_rgba(255,153,51,0.3)]">
        <span className="material-symbols-outlined" data-icon="home" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
        <span className="font-label-md text-label-md">Home</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant/70 p-2 hover:text-primary transition-all active:scale-90 duration-200">
        <span className="material-symbols-outlined" data-icon="explore">explore</span>
        <span className="font-label-md text-label-md">Explore</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant/70 p-2 hover:text-primary transition-all active:scale-90 duration-200">
        <span className="material-symbols-outlined" data-icon="movie">movie</span>
        <span className="font-label-md text-label-md">Reels</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant/70 p-2 hover:text-primary transition-all active:scale-90 duration-200">
        <span className="material-symbols-outlined" data-icon="gpp_maybe">gpp_maybe</span>
        <span className="font-label-md text-label-md">Safety</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant/70 p-2 hover:text-primary transition-all active:scale-90 duration-200">
        <span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
        <span className="font-label-md text-label-md">Profile</span>
      </div>
    </nav>
  );
}
