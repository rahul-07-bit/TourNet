import React from 'react';

export default function Expeditions() {
  return (
    <section className="container mx-auto px-container-margin mt-stack-lg">
      <div className="flex items-end justify-between mb-stack-md">
        <div>
          <h2 className="font-headline-sm text-headline-sm">Personalized Expeditions</h2>
          <p className="text-on-surface-variant">AI-curated based on your safety preferences and history.</p>
        </div>
        <button className="text-primary font-label-lg flex items-center hover:underline">
          View all <span className="material-symbols-outlined ml-1" data-icon="arrow_forward">arrow_forward</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Large Recommendation Card */}
        <div className="md:col-span-8 group relative rounded-3xl overflow-hidden glass aspect-video md:aspect-auto">
          <img 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt="Taj Mahal" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy65DXvuDJ647wO-cMNYnqy4aRA8-qn2DmCghAmM8lv0NSqLXN_g78-yxrCSThpNeQr79eysrsgvS5ZmX-WvysEouFCkzdR452ltB82G_cpLZ2NGxt28IFM2_QPWk8IebMalSKt2n5MGnvc52_dL1yoqBiIp4uNtApz7QoESoGBu6rc5dU4SR4D6miT4Oej7AXMrjckYs08Cyod2Uo8YKMKBUfesefu7GpIlJHp17W8X7m99rhz5V5xyJypG9dkVPz8c-x2N3xmXiG"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-stack-lg w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-secondary px-3 py-1 rounded-full text-[10px] font-bold text-on-secondary uppercase tracking-widest">Safer Alternative</span>
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">AI Reason: 15% Less Crowded</span>
            </div>
            <h3 className="text-headline-md font-headline-md mb-2 text-white">The Silent Mughal Dawn</h3>
            <p className="text-on-surface-variant max-w-lg mb-stack-md text-white/80">Experience Agra's majesty through our verified VIP route that bypasses 80% of peak-hour crowds.</p>
            <div className="flex gap-stack-sm">
              <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[20px]" data-icon="book_online">book_online</span>
                Book Private Tour
              </button>
            </div>
          </div>
        </div>
        
        {/* Leaderboard / Social */}
        <div className="md:col-span-4 flex flex-col gap-gutter">
          <div className="glass p-stack-md rounded-3xl flex-1 border-white/5">
            <h4 className="font-headline-sm text-headline-sm mb-stack-md text-[18px]">Top Explorers</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-primary-container p-0.5">
                    <img className="w-full h-full object-cover rounded-full" alt="Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-162PqOcdaZIFaZc3czLyceHGnNXe7WScQw16Y26BgezBItGTteOvCVbLUyuB2khToW4C2RIGaUE9ItKjE7rDW1zrpesvDw7RSCzgBSxEI5-ohmEL9My9a2_bWOSU7iSEJ2ydtt5Dix5ZXwPHdeHsi3EzG_zWrdI7nM2X8fO5aGU9hd7i2bZ6tSj5mX_7Tix3s97ouClAmrMGs4GHXDkjLpCFhr77DkWfhoaSRSVfJe_jDHOAD20TQEH1uyuHoXa904wRkucacYYA" />
                  </div>
                  <div>
                    <p className="text-label-lg font-bold">Vikram Sethi</p>
                    <p className="text-[10px] text-on-surface-variant">Heritage Elite • 4.2k XP</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary-container" data-icon="military_tech">military_tech</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 p-0.5">
                    <img className="w-full h-full object-cover rounded-full" alt="Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOJj-CL9v6gv-P7Uo_Oikj0gnomTOQ31ieJAs6tseapElP5Q71rl4YxF85iyDdSePW2dd12ipK1FdOWcMv5zMwFYLdCeyGJt1UJ8NyPUVpDp55MpTXpFv5rZfCSHNwEss_FmDTbEJuqGq7lxg92J8e_MSf1cv8-vdGv1U6gX0rqwVJmBEp4MZoUGV5z3medlB42ixXFSC44OeT45ZdPmHWpISrxs8fz6iTzZ9B91CP7kiv6wEciHLTaTL2Qat6NPtUoCjK5RtQQqb9" />
                  </div>
                  <div>
                    <p className="text-label-lg font-bold">Ananya Rao</p>
                    <p className="text-[10px] text-on-surface-variant">Eco-Guardian • 3.8k XP</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant/30" data-icon="military_tech">military_tech</span>
              </div>
            </div>
            
            <hr className="my-4 border-white/5" />
            <p className="text-label-md text-on-surface-variant mb-2">Your Progress</p>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[65%] h-full bg-primary-container shadow-[0_0_8px_#ff9933]"></div>
            </div>
            <p className="text-[10px] text-right mt-1 text-primary">240 XP to Gold Tier</p>
          </div>
        </div>
      </div>
    </section>
  );
}
