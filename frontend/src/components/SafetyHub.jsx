import React from 'react';

const featureIndicators = [
  { icon: 'health_and_safety', label: 'Instant Alert', tone: 'green' },
  { icon: 'location_on', label: 'Share Location', tone: 'gold' },
  { icon: 'bolt', label: '5 Min Response', tone: 'red' },
];

const safetyCards = [
  { icon: 'verified_user', label: 'Safety Index', value: 'Not available', detail: 'Live safety data unavailable', tone: 'green' },
  { icon: 'local_hospital', label: 'Medical Support', value: 'Not available', detail: 'Nearby hospitals unavailable', tone: 'cyan' },
  { icon: 'local_police', label: 'Police Stations', value: 'Not available', detail: 'Nearby police support unavailable', tone: 'purple' },
  { icon: 'groups', label: 'Community Support', value: 'Not available', detail: 'Community data unavailable', tone: 'orange' },
  { icon: 'call', label: 'Emergency Helpline', value: '112', detail: 'India national emergency number', tone: 'teal' },
];

const toneClasses = {
  green: 'from-emerald-500/24 to-emerald-500/5 text-emerald-300 border-emerald-400/18 shadow-emerald-500/10',
  gold: 'from-amber-500/24 to-amber-500/5 text-amber-300 border-amber-400/18 shadow-amber-500/10',
  red: 'from-red-500/24 to-red-500/5 text-red-200 border-red-400/18 shadow-red-500/10',
  cyan: 'from-cyan-500/24 to-cyan-500/5 text-cyan-300 border-cyan-400/18 shadow-cyan-500/10',
  purple: 'from-purple-500/24 to-purple-500/5 text-purple-300 border-purple-400/18 shadow-purple-500/10',
  orange: 'from-orange-500/24 to-orange-500/5 text-orange-300 border-orange-400/18 shadow-orange-500/10',
  teal: 'from-teal-500/24 to-teal-500/5 text-teal-300 border-teal-400/18 shadow-teal-500/10',
};

export default function SafetyHub() {
  return (
    <section className="container mx-auto mt-stack-lg px-container-margin pb-[calc(112px+env(safe-area-inset-bottom))]" data-deploy-sync="safety-2026-09-01">
      <div className="relative overflow-hidden rounded-[28px] border border-red-300/18 bg-[radial-gradient(circle_at_14%_50%,rgba(255,55,67,0.28),transparent_28%),linear-gradient(135deg,rgba(80,8,18,0.84),rgba(18,8,18,0.94)_54%,rgba(8,7,14,0.96))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-7 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),transparent_34%,rgba(255,71,87,0.05))]" />
        <div className="relative grid items-center gap-7 lg:grid-cols-[220px_1fr_360px] xl:grid-cols-[250px_1fr_420px]">
          <div className="flex justify-center lg:justify-start">
            <div className="relative grid h-40 w-40 place-items-center sm:h-48 sm:w-48">
              <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl animate-pulse" />
              <div className="absolute h-full w-full rounded-full border border-red-200/12 bg-red-500/10 shadow-[0_0_70px_rgba(255,46,63,0.28)]" />
              <div className="absolute h-[74%] w-[74%] rounded-full border border-red-100/26 bg-red-400/22 shadow-[0_0_42px_rgba(255,77,88,0.42)]" />
              <button className="relative grid h-28 w-28 place-items-center rounded-full border border-white/70 bg-[radial-gradient(circle_at_50%_34%,#fff,#ffe7e7_58%,#ffb7b7)] text-error-container shadow-[0_18px_55px_rgba(255,42,58,0.42)] transition-transform hover:scale-105 active:scale-95 sm:h-32 sm:w-32">
                <span className="material-symbols-outlined text-[44px] leading-none" data-icon="emergency" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
                <span className="mt-[-10px] text-lg font-black tracking-wide">SOS</span>
              </button>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-red-200/80">Emergency ready</p>
            <h2 className="mb-4 text-[34px] font-black leading-tight tracking-normal text-red-200 drop-shadow-[0_0_18px_rgba(255,76,91,0.45)] sm:text-[44px]">
              SOS Pulse Active
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-red-50/86 sm:text-lg lg:mx-0">
              One tap triggers immediate location broadcasting to local authorities and nearest 'TOURNET' response teams. Guaranteed 5-minute initial remote response.
            </p>
            <div className="mt-6 flex snap-x gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
              {featureIndicators.map((item) => (
                <div key={item.label} className={`flex min-w-max snap-start items-center gap-3 rounded-2xl border bg-gradient-to-br px-4 py-3 shadow-lg ${toneClasses[item.tone]}`}>
                  <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  <span className="text-sm font-extrabold text-white/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative hidden min-h-[190px] overflow-hidden rounded-[24px] border border-red-200/12 bg-black/22 lg:block">
              <div className="absolute inset-0 opacity-35" style={{ backgroundImage: 'linear-gradient(rgba(255,110,92,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,110,92,.12) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-300/18" />
              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-300/10" />
              <div className="absolute left-[52%] top-[48%] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-400 text-white shadow-[0_0_45px_rgba(255,61,76,0.70)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/8 bg-black/35 px-4 py-3 backdrop-blur-xl">
                <span className="text-xs font-bold text-red-50/72">Location broadcast standby</span>
                <span className="h-2 w-2 rounded-full bg-red-300 shadow-[0_0_14px_rgba(255,82,98,0.9)]" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="glass rounded-3xl border border-emerald-300/12 p-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/16 text-emerald-300" data-icon="location_searching">location_searching</span>
                  <div>
                    <p className="text-label-md font-bold text-white">Live Tracking</p>
                    <p className="text-[11px] text-on-surface-variant">Active for the next 48h</p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl border border-primary/12 p-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined grid h-12 w-12 place-items-center rounded-2xl bg-primary-container/16 text-primary" data-icon="support_agent">support_agent</span>
                  <div>
                    <p className="text-label-md font-bold text-white">24/7 Concierge</p>
                    <p className="text-[11px] text-on-surface-variant">Connected via satellite link</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-9">
        <div className="mb-5 flex items-center gap-3">
          <span className="material-symbols-outlined grid h-10 w-10 place-items-center rounded-2xl bg-primary-container text-on-primary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
          <h3 className="text-2xl font-black text-white">Safety at a Glance</h3>
        </div>

        <div className="grid gap-4 overflow-hidden md:grid-cols-2 xl:grid-cols-5">
          {safetyCards.map((card) => (
            <article key={card.label} className={`min-w-0 rounded-[22px] border bg-gradient-to-br p-5 shadow-xl ${toneClasses[card.tone]}`}>
              <div className="mb-5 flex items-center gap-4 xl:block">
                <span className="material-symbols-outlined grid h-14 w-14 flex-none place-items-center rounded-2xl bg-current/10 text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                <p className="text-sm font-bold text-white/84 xl:mt-4">{card.label}</p>
              </div>
              <p className={`break-words text-2xl font-black leading-tight ${card.value === 'Not available' ? 'text-white/62' : ''}`}>{card.value}</p>
              <p className="mt-2 text-sm leading-5 text-white/58">{card.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-7 rounded-[24px] border border-primary-container/24 bg-[linear-gradient(135deg,rgba(255,153,51,0.13),rgba(23,12,15,0.78))] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.32)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="material-symbols-outlined grid h-16 w-16 flex-none place-items-center rounded-3xl bg-primary-container/16 text-[34px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-black text-primary-container">Safety Tip of the Day</h3>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant sm:text-base">
              Stay aware of your surroundings, keep emergency contacts handy, and share your route with someone you trust before heading out.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
