import React from 'react';

export default function Analytics() {
  return (
    <section className="container mx-auto px-container-margin mt-stack-lg grid grid-cols-1 md:grid-cols-3 gap-gutter">
      <div className="glass p-stack-md rounded-3xl border-white/5">
        <h4 className="font-bold text-label-lg mb-stack-md">Blockchain Reviews</h4>
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-xl border-l-4 border-secondary">
            <p className="text-[12px] italic mb-2">"The real-time crowd alerts saved our trip to Varanasi. 100% verified route."</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-secondary font-bold">Hash: 0x4f...2d</span>
              <span className="text-[10px] text-on-surface-variant">2 mins ago</span>
            </div>
          </div>
          
          <div className="p-3 bg-white/5 rounded-xl border-l-4 border-secondary">
            <p className="text-[12px] italic mb-2">"Safe-stay badge at Jaipur Heritage was accurate. Highly recommended."</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-secondary font-bold">Hash: 0x8a...9c</span>
              <span className="text-[10px] text-on-surface-variant">1h ago</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass p-stack-md rounded-3xl border-white/5 md:col-span-2">
        <div className="flex items-center justify-between mb-stack-md">
          <h4 className="font-bold text-label-lg">Travel Analytics</h4>
          <span className="text-[10px] text-primary uppercase font-bold tracking-widest">Global Ecosystem</span>
        </div>
        
        <div className="flex items-end gap-2 h-40">
          <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[40%] hover:bg-primary/40 transition-all">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px]">Mon</div>
          </div>
          <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[65%] hover:bg-primary/40 transition-all">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px]">Tue</div>
          </div>
          <div className="flex-1 bg-primary-container/80 rounded-t-lg relative group h-[90%] hover:bg-primary/40 transition-all shadow-[0_0_15px_rgba(255,153,51,0.3)]">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-100 text-[10px] font-bold text-primary">Wed</div>
          </div>
          <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[55%] hover:bg-primary/40 transition-all">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px]">Thu</div>
          </div>
          <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[75%] hover:bg-primary/40 transition-all">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px]">Fri</div>
          </div>
          <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[85%] hover:bg-primary/40 transition-all">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px]">Sat</div>
          </div>
          <div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[60%] hover:bg-primary/40 transition-all">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px]">Sun</div>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-on-surface-variant mt-4">Total platform user movement safety index: 94.2%</p>
      </div>
    </section>
  );
}
