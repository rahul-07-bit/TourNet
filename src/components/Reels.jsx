import React from 'react';

export default function Reels() {
  return (
    <section className="mt-stack-lg">
      <div className="container mx-auto px-container-margin mb-stack-md flex justify-between items-center">
        <h2 className="font-headline-sm text-headline-sm">Trending Travel Reels</h2>
        <button className="text-on-surface-variant text-label-md flex items-center">
          Full Experience <span className="material-symbols-outlined ml-1" data-icon="open_in_full">open_in_full</span>
        </button>
      </div>
      
      <div className="flex gap-gutter overflow-x-auto no-scrollbar px-container-margin">
        {/* Reel Item 1 */}
        <div className="flex-shrink-0 w-72 aspect-[9/16] rounded-3xl overflow-hidden relative group">
          <img 
            className="w-full h-full object-cover" 
            alt="Ladakh" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL0PaRWOjP-nFkqTUeZXoYFGmm73YTLexrsMJfY6yqAkCBWYjZ7MGM6mXI_i27pCa0KZMiA8Y69SMQjDgj1bEp839cZnTsy-6xbSL_gZz3axO3iQO8oIiLpYvFLtDbGFl08xqJdABZklX-0tpPER3mZqQqAZ2ZRzkIS9usZZVC9GLRU11vNN_1mYj62QURUMH8zi1mCjym80Xw7hGlNgiHJmdGwvIMuAOyzxLq8MgJtDbE60koUSX3dwCFDCBIzvbRNNM4ubDVJfQr" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute top-4 left-4 flex items-center gap-2 glass px-2 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px] text-primary" data-icon="location_on">location_on</span>
            <span className="text-[10px] font-bold text-white uppercase">Ladakh, IN</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-bold text-label-lg mb-stack-sm">Hidden Azure Canyons</p>
            <button className="w-full py-2 glass rounded-xl text-label-md text-primary font-bold hover:bg-primary-container hover:text-on-primary-container transition-all">Plan This Trip</button>
          </div>
        </div>
        
        {/* Reel Item 2 */}
        <div className="flex-shrink-0 w-72 aspect-[9/16] rounded-3xl overflow-hidden relative group">
          <img 
            className="w-full h-full object-cover" 
            alt="Jaipur" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_VaaCm79GUzQe0FCsbUde1LXAVkLM6oQ7vQuS8LbUgwU--muDj8Nwl82C2DVd7aENgxdP5pHfq_cSNotqPSHBAoOhnMlVZOwmg6jhhr5TFHtoGorcDeiWlFVCR-9hoqmDa1y3l8knV__UeQQvyoxA5jhUr1sRFX6gpdGt7EfQFnVzSRUx_KSCNPtMJGDPfptYkMXOZwNZ01qKMbjb8qlOAyvH0LtdGAfIdZn6-2DGRiJqifWThOmJo1JqgDdqno8y4K38IorDsLMn" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute top-4 left-4 flex items-center gap-2 glass px-2 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px] text-primary" data-icon="location_on">location_on</span>
            <span className="text-[10px] font-bold text-white uppercase">Jaipur, IN</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-bold text-label-lg mb-stack-sm">The Saffron Route</p>
            <button className="w-full py-2 glass rounded-xl text-label-md text-primary font-bold hover:bg-primary-container hover:text-on-primary-container transition-all">Plan This Trip</button>
          </div>
        </div>
        
        {/* Reel Item 3 */}
        <div className="flex-shrink-0 w-72 aspect-[9/16] rounded-3xl overflow-hidden relative group">
          <img 
            className="w-full h-full object-cover" 
            alt="Kerala" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnRNTnipg29t6U8TrHAA3YtX4cNq6TYC3RXyjUeaZ4YQVRKr8I39IVPRCALVWoWCmiadhWnCE9_aT3Hv08Dxm2mm204VKmCJwLy0yiUGLo6LovTVFCFYKrHNiX8fC7Xk_euEm2E4l6ZmD4fpycg5pwZKZvFNxTR1To_5iaCyrKbOoOAlaxclsjGuQ-p2mL04hMQ20LWclFofb3E4agLXkw6qMjZX99T69omrMHekLq0YlbofmRozzJWDqgqpSJTDMLxm_PkG4l7Ik4" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute top-4 left-4 flex items-center gap-2 glass px-2 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px] text-primary" data-icon="location_on">location_on</span>
            <span className="text-[10px] font-bold text-white uppercase">Kerala, IN</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-bold text-label-lg mb-stack-sm">Floating Serenities</p>
            <button className="w-full py-2 glass rounded-xl text-label-md text-primary font-bold hover:bg-primary-container hover:text-on-primary-container transition-all">Plan This Trip</button>
          </div>
        </div>
      </div>
    </section>
  );
}
