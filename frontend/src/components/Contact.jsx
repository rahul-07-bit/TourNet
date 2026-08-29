import React from 'react';

export default function Contact() {
  return (
    <section className="container mx-auto px-container-margin mt-stack-lg mb-stack-lg" id="contact">
      <div className="glass rounded-[32px] overflow-hidden grid grid-cols-1 md:grid-cols-2 border-white/5 shadow-2xl">
        <div className="p-stack-lg border-b md:border-b-0 md:border-r border-white/5">
          <h2 className="font-headline-sm text-headline-sm mb-2">Connect with Excellence</h2>
          <p className="text-on-surface-variant mb-stack-lg">Our global support teams and AI analysts are available 24/7 for tailored inquiries.</p>
          
          <form className="space-y-gutter">
            <div className="space-y-1">
              <label className="text-label-md text-primary ml-1">Full Name</label>
              <input 
                className="w-full bg-white/5 border-0 border-b border-white/10 focus:border-primary-container focus:ring-0 transition-all text-body-md py-3 px-4 rounded-t-xl outline-none" 
                placeholder="Arjun Singh" 
                type="text" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-label-md text-primary ml-1">Email Address</label>
              <input 
                className="w-full bg-white/5 border-0 border-b border-white/10 focus:border-primary-container focus:ring-0 transition-all text-body-md py-3 px-4 rounded-t-xl outline-none" 
                placeholder="arjun@premium.com" 
                type="email" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-label-md text-primary ml-1">Message</label>
              <textarea 
                className="w-full bg-white/5 border-0 border-b border-white/10 focus:border-primary-container focus:ring-0 transition-all text-body-md py-3 px-4 rounded-t-xl outline-none" 
                placeholder="How can we assist your journey?" 
                rows="4"
              ></textarea>
            </div>
            
            <button className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-2xl shadow-[0_0_20px_rgba(255,153,51,0.4)] hover:brightness-110 active:scale-95 transition-all">
              Send Encrypted Message
            </button>
          </form>
        </div>
        
        <div className="p-stack-lg flex flex-col">
          <div className="flex-1">
            <h3 className="text-label-lg font-bold mb-4 uppercase tracking-widest text-on-surface-variant">Contact Hubs</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary" data-icon="mail">mail</span>
                <div>
                  <p className="text-label-md font-bold">Email Support</p>
                  <p className="text-body-md text-on-surface-variant">concierge@tournet.in</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary" data-icon="call">call</span>
                <div>
                  <p className="text-label-md font-bold">Global Safety Line</p>
                  <p className="text-body-md text-on-surface-variant">+91 1800-TOUR-NET</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary" data-icon="share">share</span>
                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                    </svg>
                  </span>
                  <span className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.312 2.69.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-48 glass rounded-2xl overflow-hidden mt-6 relative grayscale hover:grayscale-0 transition-all cursor-crosshair">
            <img 
              className="w-full h-full object-cover" 
              alt="Bangalore Corporate Office" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC65mSnlzCx1qiwfTyNBl1WRLAb2tKSkiowh4b4NNn0DXhj-jD6dbL38Ds6BbvXDPvCUziWJYnvWxsRr72LiE2Jtn_dvAlL1lvZhk_y0nw6_oSJZ4Mqa9xM2xkdezvD1flbPKnz3MxihKtoTTD-te0QioCg-sgVa5xfRlE4IY8U44fuEnDJABa9VBceE-y-FtCDFk6lu1PRXiDtidDJ7tte2yxzt_fB8at_ZjBis7VahjClJRSTpWXNxS1Qihdn59rdyP9CftyHiFuZ" 
            />
            <div className="absolute inset-0 bg-primary/10"></div>
            <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur px-3 py-1 rounded-lg border border-white/10">
              <p className="text-[10px] font-bold">Bharat HQ: Gurgaon, IN</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
