import React from 'react';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          alt="Varanasi Ganges" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFNlfhEWDeQIKEZ9gvbZQZpHFYP4Fo9Uj2MwaDS_iO8U9B4tku_Bvt0respIyQq1Kh9FDr3TKCZeo9x6482KrtNtu3gkw8TfWWET8fPGMQ_4G7DY_WGtBSKHyBVwmS80SwN3oyEM0TGcFIkJSXFgfbbp2gZc-_lUso48zEYX27Hz_jSOz_MXfKNQrqXU-cZfM77oC9qpVXKBkbY6owJxMbfrXTYMXdo1IpDXnbfenzOHBQpC4p88aX1lB3nn4F_idLNZyvGDE_2Kpu"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-container-margin text-center">
        <div className="inline-flex items-center px-4 py-1 rounded-full glass border-primary/20 mb-stack-md">
          <span className="w-2 h-2 rounded-full bg-secondary mr-2 shadow-[0_0_8px_#72de5c]"></span>
          <span className="text-label-md font-label-md text-secondary">LIVE: Safety Network Active</span>
        </div>
        
        <h2 className="font-headline-lg text-headline-lg mb-stack-lg max-w-4xl mx-auto leading-tight">
          Discover your next <span className="text-primary-container drop-shadow-[0_0_10px_rgba(255,153,51,0.5)]">safe</span> horizon
        </h2>
        
        <div className="max-w-2xl mx-auto glass rounded-2xl p-2 inner-glow flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant ml-3" data-icon="travel_explore">travel_explore</span>
          <input 
            className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-on-surface-variant/50 text-white outline-none" 
            placeholder="Search destinations, safety scores, or AI tours..." 
            type="text"
          />
          <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all">
            AI Explore
          </button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-stack-sm mt-stack-md">
          <span className="px-3 py-1 glass rounded-full text-label-md text-on-surface-variant border-white/5 cursor-pointer hover:bg-white/10">#VaranasiGhats</span>
          <span className="px-3 py-1 glass rounded-full text-label-md text-on-surface-variant border-white/5 cursor-pointer hover:bg-white/10">#HimalayanSafeRoutes</span>
          <span className="px-3 py-1 glass rounded-full text-label-md text-on-surface-variant border-white/5 cursor-pointer hover:bg-white/10">#LowCrowdGoa</span>
        </div>
      </div>
    </section>
  );
}
