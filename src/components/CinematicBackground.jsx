import React, { useState, useEffect, useRef } from 'react';

/* ─── Seeded random for particle consistency ────────────────── */
function sr(seed) {
  const x = Math.sin(seed + 1.618) * 73856;
  return x - Math.floor(x);
}

/* ─── Pre-computed ambient golden dust (extremely subtle) ───── */
const DUST = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  left: sr(i * 113) * 100,
  bot: 10 + sr(i * 127) * 60,
  sz: 0.6 + sr(i * 131) * 1.2,
  dur: 16 + sr(i * 137) * 18,
  del: sr(i * 139) * 12,
  px: (sr(i * 149) - 0.5) * 45,
}));

export default function CinematicBackground() {
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* Parallax scroll speeds */
  const pBg   = scrollY * 0.35;
  const pMist = scrollY * 0.20;
  const pFore = scrollY * 0.05;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none', userSelect: 'none' }}>

      {/* ── Layer 0: Morning Sunrise Sky Gradient ──────────────── */}
      <div style={{
        position: 'absolute', inset: '-20px',
        background: `
          radial-gradient(ellipse 130% 90% at 50% 100%, #1e1108 0%, #0d0615 45%, #04020a 100%),
          radial-gradient(ellipse 60% 40% at 50% 60%, rgba(255, 120, 20, 0.06) 0%, transparent 60%)
        `,
        transform: `translateY(${pBg * 0.05}px)`,
      }} />

      {/* ── Layer 1: Himalayan Mountain Photo ──────────────────── */}
      <div style={{
        position: 'absolute', top: '-6%', bottom: '-6%', left: '-5%', right: '-5%',
        transform: `translateY(${pBg}px) scale(1.05)`,
        willChange: 'transform',
      }}>
        <img
          src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1920&q=80"
          alt="Majestic Himalayas Sunrise"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 35%',
          }}
          className="animate-ken-burns"
        />

        {/* Global dark LUT overlay (45% opacity for general contrast) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to top,
              rgba(5,3,14,0.98) 0%,
              rgba(5,3,14,0.78)  12%,
              rgba(5,3,14,0.48)  35%,
              rgba(5,3,14,0.30)  55%,
              rgba(5,3,14,0.45) 75%,
              rgba(5,3,14,0.85) 100%
            )
          `,
        }} />

        {/* Sunrise horizon light glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 80% 40% at 50% 48%,
              rgba(255,140,20,0.12) 0%,
              rgba(200,70,10,0.04) 50%,
              transparent 72%
            )
          `,
        }} />

        {/* Side vignettes */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(5,3,14,0.75) 0%, transparent 15%, transparent 85%, rgba(5,3,14,0.75) 100%)',
        }} />
      </div>

      {/* ── Layer 2: Valleys Morning Mist (Realistic Depth) ───── */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translateY(${pMist}px)`,
      }}>
        {[
          { bot: '20%', h: '16%', op: 0.12, dur: '28s', del: '0s' },
          { bot: '15%', h: '12%', op: 0.08, dur: '36s', del: '-6s' },
          { bot: '25%', h: '14%', op: 0.09, dur: '22s', del: '-12s' },
        ].map((fog, i) => (
          <div key={`mist-${i}`} className="animate-fog" style={{
            position: 'absolute', left: '-10%', width: '120%',
            bottom: fog.bot, height: fog.h,
            background: `linear-gradient(to right,
              transparent 0%,
              rgba(255, 255, 255, ${fog.op}) 20%,
              rgba(255, 240, 220, ${fog.op * 1.4}) 50%,
              rgba(255, 255, 255, ${fog.op}) 80%,
              transparent 100%
            )`,
            filter: 'blur(28px)',
            animationDuration: fog.dur,
            animationDelay: fog.del,
            '--fo': fog.op,
          }} />
        ))}
      </div>

      {/* ── Layer 3: Foreground Valley Mist ────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translateY(${pFore}px)`,
      }}>
        {[
          { bot: '12%', h: '8%',  op: 0.07, dur: '18s', del: '-4s'  },
          { bot: '8%',  h: '6%',  op: 0.05, dur: '24s', del: '-10s' },
        ].map((fog, i) => (
          <div key={`fmist-${i}`} className="animate-fog" style={{
            position: 'absolute', left: '-10%', width: '120%',
            bottom: fog.bot, height: fog.h,
            background: `linear-gradient(to right,
              transparent 0%,
              rgba(255, 255, 255, ${fog.op}) 25%,
              rgba(255, 245, 230, ${fog.op * 1.3}) 50%,
              rgba(255, 255, 255, ${fog.op}) 75%,
              transparent 100%
            )`,
            filter: 'blur(20px)',
            animationDuration: fog.dur,
            animationDelay: fog.del,
            '--fo': fog.op,
          }} />
        ))}
      </div>

      {/* ── Layer 4: Ambient Golden Dust (Extremely Subtle) ───── */}
      <div style={{
        position: 'absolute', inset: 0,
        transform: `translateY(${pFore * 0.5}px)`,
      }}>
        {DUST.map((d) => (
          <div key={`dust-${d.id}`} className="animate-particle" style={{
            position: 'absolute',
            left: `${d.left}%`, bottom: `${d.bot}%`,
            width: d.sz, height: d.sz,
            borderRadius: '50%',
            background: 'rgba(255,210,130,0.40)',
            boxShadow: `0 0 ${d.sz * 2}px rgba(255,200,100,0.25)`,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.del}s`,
            '--px': `${d.px}px`,
            filter: 'blur(0.2px)',
          }} />
        ))}
      </div>

      {/* ── Layer 5: Dark Vignette borders ─────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none' }}>
        {/* Bottom dark blend to page */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '16%',
          background: 'linear-gradient(to top, #05030e 0%, transparent 100%)',
        }} />
        {/* Top dark gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '14%',
          background: 'linear-gradient(to bottom, rgba(5,3,14,0.85) 0%, transparent 100%)',
        }} />
        {/* Cinematic vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          boxShadow: 'inset 0 0 100px rgba(5,3,14,0.55)',
        }} />
      </div>

    </div>
  );
}
