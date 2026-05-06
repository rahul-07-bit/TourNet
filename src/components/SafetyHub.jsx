import React from 'react';

export default function SafetyHub() {
  return (
    <section className="container mx-auto px-container-margin mt-stack-lg">
      <div className="bg-error-container/20 border border-error/20 rounded-3xl p-stack-lg flex flex-col md:flex-row items-center gap-stack-lg">
        <div className="relative">
          <div className="absolute inset-0 bg-error/30 blur-3xl animate-pulse rounded-full"></div>
          <button className="relative w-32 h-32 rounded-full bg-error flex items-center justify-center shadow-[0_0_50px_rgba(255,180,171,0.4)] hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[48px] text-on-error" data-icon="emergency" style={{fontVariationSettings: "'FILL' 1"}}>emergency</span>
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="font-headline-md text-headline-md text-error mb-2">SOS Pulse Active</h2>
          <p className="text-on-surface-variant max-w-xl">One tap triggers immediate location broadcasting to local authorities and nearest 'TOURNET' response teams. Guaranteed 5-minute initial remote response.</p>
        </div>
        
        <div className="flex flex-col gap-gutter w-full md:w-auto">
          <div className="glass p-4 rounded-2xl flex items-center gap-4">
            <span className="material-symbols-outlined text-secondary" data-icon="location_searching">location_searching</span>
            <div>
              <p className="text-label-md font-bold">Live Tracking</p>
              <p className="text-[10px] text-on-surface-variant">Active for the next 48h</p>
            </div>
          </div>
          
          <div className="glass p-4 rounded-2xl flex items-center gap-4">
            <span className="material-symbols-outlined text-primary" data-icon="support_agent">support_agent</span>
            <div>
              <p className="text-label-md font-bold">24/7 Concierge</p>
              <p className="text-[10px] text-on-surface-variant">Connected via satellite link</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
