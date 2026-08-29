import React from 'react';

const REELS_DATA = [
  {
    id: 'reel-ladakh',
    location: 'LADAKH, IN',
    title: 'Hidden Azure Canyons',
    image: '/ladakh_mountains.png',
    glowColor: 'group-hover:shadow-[0_15px_30px_rgba(59,130,246,0.35)]',
    buttonGlow: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] border-blue-400/30'
  },
  {
    id: 'reel-jaipur',
    location: 'JAIPUR, IN',
    title: 'The Saffron Route',
    image: '/jaipur_palace.png',
    glowColor: 'group-hover:shadow-[0_15px_30px_rgba(245,158,11,0.35)]',
    buttonGlow: 'hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-400/30'
  },
  {
    id: 'reel-kerala',
    location: 'KERALA, IN',
    title: 'Floating Serenities',
    image: '/kerala_backwaters.png',
    glowColor: 'group-hover:shadow-[0_15px_30px_rgba(16,185,129,0.35)]',
    buttonGlow: 'hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-400/30'
  },
  {
    id: 'reel-varanasi',
    location: 'VARANASI, IN',
    title: 'Sacred Ganga Aarti',
    image: '/ganga_aarti.png',
    glowColor: 'group-hover:shadow-[0_15px_30px_rgba(239,68,68,0.35)]',
    buttonGlow: 'hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-400/30'
  },
  {
    id: 'reel-goa',
    location: 'GOA, IN',
    title: 'Sunset Beach Bliss',
    image: '/goa_sunset.png',
    glowColor: 'group-hover:shadow-[0_15px_30px_rgba(244,63,94,0.35)]',
    buttonGlow: 'hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] border-rose-400/30'
  }
];

export default function ReelsPreview() {
  return (
    <section className="mt-16 relative">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-container-margin mb-6 flex justify-between items-center relative z-10">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-white/95 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container" data-icon="movie" style={{fontVariationSettings: "'FILL' 1"}}>movie</span>
            Trending Travel Reels
          </h2>
          <p className="text-[12px] text-on-surface-variant/75 mt-1">Immersive stories and cinematic glances from explorers</p>
        </div>
        <button 
          onClick={() => alert('Full cinematic reels screen requested! 🎬')}
          className="text-on-surface-variant hover:text-primary text-label-md flex items-center gap-1 glass px-3 py-1.5 rounded-full border border-white/5 transition-all active:scale-95"
        >
          Full Experience 
          <span className="material-symbols-outlined text-[16px]" data-icon="open_in_full">open_in_full</span>
        </button>
      </div>
      
      {/* Horizontal card list */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar px-container-margin pb-6 scroll-smooth relative z-10">
        {REELS_DATA.map((reel) => (
          <div 
            key={reel.id}
            className={`flex-shrink-0 w-72 aspect-[9/16] rounded-3xl overflow-hidden relative group cursor-pointer transition-all duration-500 hover:translate-y-[-10px] border border-white/10 hover:border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${reel.glowColor}`}
          >
            {/* Immersive Image */}
            <img 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              alt={reel.title} 
              src={reel.image} 
            />

            {/* Dark Overlay Vignette for text contrast */}
            <div className="absolute inset-0 card-gradient-overlay opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
            
            {/* Top-Left Location Tag */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 glass backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
              <span className="material-symbols-outlined text-[13px] text-primary" data-icon="location_on">location_on</span>
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">{reel.location}</span>
            </div>

            {/* Bookmark button overlay */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Saved ${reel.title} to bookmarks! 📌`);
                }}
                className="w-8 h-8 rounded-full glass flex items-center justify-center border border-white/10 text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">bookmark</span>
              </button>
            </div>

            {/* Bottom Content overlay */}
            <div className="absolute bottom-5 left-5 right-5 space-y-4">
              <div>
                <p className="text-white font-extrabold text-[18px] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {reel.title}
                </p>
              </div>

              {/* Glowing "Plan This Trip" button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`AI itinerary generation initialized for ${reel.title}! 🗺️`);
                }}
                className={`w-full py-2.5 glass rounded-xl text-label-md text-primary font-bold hover:bg-primary-container hover:text-on-primary-container transition-all duration-300 border ${reel.buttonGlow}`}
              >
                Plan This Trip
              </button>
            </div>

            {/* Apple Vision Pro inspired sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        ))}
      </div>
    </section>
  );
}
