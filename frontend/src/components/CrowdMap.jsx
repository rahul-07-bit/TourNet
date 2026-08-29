import React from 'react';

export default function CrowdMap() {
  return (
    <section className="container mx-auto px-container-margin mt-stack-lg">
      <div className="glass rounded-3xl overflow-hidden h-[500px] relative border-white/5">
        <div className="absolute top-6 left-6 z-10 space-y-2">
          <div className="glass p-stack-md rounded-2xl w-64 inner-glow bg-background/80">
            <h4 className="font-bold text-label-lg mb-1">Live Crowd Heatmap</h4>
            <p className="text-[10px] text-on-surface-variant mb-3">Real-time density from 14k sensors.</p>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-label-md">High Density: Delhi NCR</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              <span className="text-label-md">Optimal: Coorg, Karnataka</span>
            </div>
            
            <button className="w-full mt-4 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-label-md transition-all">Avoid Crowds Routing</button>
          </div>
        </div>
        
        {/* Map Background */}
        <div className="w-full h-full bg-surface-container">
          <img 
            className="w-full h-full object-cover opacity-40 grayscale contrast-125" 
            alt="India Map" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDMJ83cvOANeZW8eTxopsP6Wtkuun8Ju4iA9xZap-POpkJ85_X-LIlc9c0ovB-GsCTzagGHOjABSCxNgEhjLg0Tc16deToIn5DUTSWIVPqMz_GQVE_b_A3Wp_xq0KXX1Bx8rcVsz6hCBsUBwZxawBML0OiIoFn4W_2b2S7u8KMsQIh8j1oBJTsOPxei9bWjXNGFpV2n3Uyd7Dovo0wCxhptc8aVEry8P9w55XHxk0Tmjbe4ekDWSzLstbv-Ti5GA4vJCVDEMqhRRLI" 
          />
        </div>
      </div>
    </section>
  );
}
