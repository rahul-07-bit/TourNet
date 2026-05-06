import React from 'react';

export default function Dashboard() {
  return (
    <section className="container mx-auto px-container-margin -mt-32 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {/* Crowd Density */}
        <div className="glass p-stack-md rounded-2xl inner-glow border-primary/10">
          <div className="flex justify-between items-start mb-stack-sm">
            <span className="material-symbols-outlined text-primary-container" data-icon="groups">groups</span>
            <span className="text-secondary text-label-md">+20% Trend</span>
          </div>
          <p className="text-on-surface-variant text-label-md uppercase tracking-wider mb-1">Crowd Density</p>
          <h3 className="text-headline-sm font-headline-sm">42% <span className="text-body-md font-normal opacity-50">/ Moderate</span></h3>
          <p className="text-label-md text-on-surface-variant/70 mt-2">AI Predicts: Expected to increase by 20% in 2h.</p>
        </div>
        
        {/* Safety Status */}
        <div className="glass p-stack-md rounded-2xl inner-glow border-primary/10">
          <div className="flex justify-between items-start mb-stack-sm">
            <span className="material-symbols-outlined text-secondary" data-icon="verified_user">verified_user</span>
            <span className="text-label-md bg-secondary/20 text-secondary px-2 py-0.5 rounded">High</span>
          </div>
          <p className="text-on-surface-variant text-label-md uppercase tracking-wider mb-1">Safety Status</p>
          <h3 className="text-headline-sm font-headline-sm">Tier 1 <span className="text-body-md font-normal opacity-50">Verified</span></h3>
          <p className="text-label-md text-on-surface-variant/70 mt-2">98% positive safety feedback recently.</p>
        </div>
        
        {/* Weather */}
        <div className="glass p-stack-md rounded-2xl inner-glow border-primary/10">
          <div className="flex justify-between items-start mb-stack-sm">
            <span className="material-symbols-outlined text-primary" data-icon="wb_sunny">wb_sunny</span>
            <span className="text-on-surface-variant text-label-md">24°C</span>
          </div>
          <p className="text-on-surface-variant text-label-md uppercase tracking-wider mb-1">Weather Context</p>
          <h3 className="text-headline-sm font-headline-sm">Clear Skies</h3>
          <p className="text-label-md text-on-surface-variant/70 mt-2">Perfect visibility for heritage photography.</p>
        </div>
        
        {/* Analytics */}
        <div className="glass p-stack-md rounded-2xl inner-glow border-primary/10">
          <div className="flex justify-between items-start mb-stack-sm">
            <span className="material-symbols-outlined text-error" data-icon="health_and_safety">health_and_safety</span>
            <span className="text-error text-label-md">Low Risk</span>
          </div>
          <p className="text-on-surface-variant text-label-md uppercase tracking-wider mb-1">Bio Risk / COVID</p>
          <h3 className="text-headline-sm font-headline-sm">Status: Green</h3>
          <p className="text-label-md text-on-surface-variant/70 mt-2">No active restrictions in this zone.</p>
        </div>
      </div>
    </section>
  );
}
