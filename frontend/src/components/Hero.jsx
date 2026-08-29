import React, { useState, useEffect, useRef } from 'react';

export default function Hero({ setActiveTab }) {
  const [scrollY, setScrollY]               = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isChatOpen, setIsChatOpen]         = useState(false);
  const [chatMessages, setChatMessages]     = useState([
    { sender: 'ai', text: 'Namaste! 🙏 I am your Tournet AI Guide. How can I help you plan your spiritual journey and exploration of the majestic Himalayas today?' }
  ]);
  const [isAiTyping, setIsAiTyping]         = useState(false);
  const [bellPulse, setBellPulse]           = useState(false);
  const audioCtxRef    = useRef(null);
  const audioIntervalRef = useRef(null);

  /* ── Parallax scroll ──────────────────────────────────────── */
  useEffect(() => {
    const handle = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  /* ── FM Bell synthesizer (Spiritual sound) ────────────────── */
  const triggerBell = (ctx, freq, dur = 3.8) => {
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.18, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    master.connect(ctx.destination);

    const carrier  = ctx.createOscillator();
    const mod      = ctx.createOscillator();
    const modGain  = ctx.createGain();
    mod.frequency.value = freq * 1.41;
    modGain.gain.value  = 140;
    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.frequency.value = freq;
    carrier.type = 'sine';
    carrier.connect(master);

    const strike     = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    strike.frequency.value = freq * 2.3;
    strikeGain.gain.setValueAtTime(0.07, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    strike.connect(strikeGain);
    strikeGain.connect(ctx.destination);

    carrier.start(now); mod.start(now); strike.start(now);
    carrier.stop(now + dur); mod.stop(now + dur); strike.stop(now + dur);
  };

  const handleAudioToggle = () => {
    if (!isAudioPlaying) {
      if (!audioCtxRef.current)
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      setIsAudioPlaying(true);
      setBellPulse(true);
      const freqs = [293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
      triggerBell(ctx, 392.00);
      audioIntervalRef.current = setInterval(() => {
        const f = freqs[Math.floor(Math.random() * freqs.length)];
        triggerBell(ctx, f);
      }, 4200);
    } else {
      clearInterval(audioIntervalRef.current);
      setIsAudioPlaying(false);
      setBellPulse(false);
    }
  };

  useEffect(() => () => { if (audioIntervalRef.current) clearInterval(audioIntervalRef.current); }, []);

  /* ── AI chat ──────────────────────────────────────────────── */
  const handleSendMessage = (text) => {
    if (isAiTyping) return;
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setIsAiTyping(true);
    setTimeout(() => {
      let reply = '';
      const query = text.toLowerCase();
      if (query.includes('trek') || query.includes('route') || query.includes('valley'))
        reply = 'I have mapped the scenic "Himalayan Sunrise Trek" for you — a moderate 5km path through the mist-shrouded valleys of Rishikesh. Safety rating: 9.8/10. Live mountain condition check: Clear. 🏔️';
      else if (query.includes('spiritual') || query.includes('retreat') || query.includes('meditation') || query.includes('ashram'))
        reply = 'The best spiritual retreats are situated in the quiet forest hills of Dharamshala and Rishikesh. Tap the Explore tab to check direct reviews and crowd status. 🧘';
      else if (query.includes('sunrise') || query.includes('viewpoint') || query.includes('peak'))
        reply = 'For the ultimate panoramic sunrise view of the snow peaks, we recommend the Kunjapuri Temple summit or Tiger Hill. Be there by 5:15 AM to catch the first golden sunbeams! ☀️';
      else
        reply = 'The Himalayas offer a perfect blend of high-altitude adventure and profound spiritual peace. Let me help you navigate routes, weather conditions, and sacred retreats. Click Explore Now to begin!';
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setIsAiTyping(false);
    }, 1600);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh' }}
    >
      {/* ── Main UI content ─────────────────────────────────── */}
      <div
        className="relative z-30 w-full max-w-2xl mx-auto px-6 text-center flex flex-col items-center"
        style={{ transform: `translateY(${scrollY * 0.08}px)` }}
      >
        {/* Subtle dark backdrop panel behind main text content for high contrast readability */}
        <div style={{
          background: 'rgba(5, 3, 14, 0.48)',
          backdropFilter: 'blur(20px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
          borderRadius: 28,
          border: '1px solid rgba(255, 140, 20, 0.12)',
          padding: '48px 32px',
          width: '100%',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 32,
        }}>
          {/* Pill: Enable Spiritual Bells */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            <button
              id="spiritual-bells-btn"
              onClick={handleAudioToggle}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '7px 18px',
                borderRadius: 999,
                border: isAudioPlaying
                  ? '1px solid rgba(255,160,60,0.55)'
                  : '1px solid rgba(255,255,255,0.10)',
                background: isAudioPlaying
                  ? 'rgba(255,120,20,0.16)'
                  : 'rgba(12,8,20,0.65)',
                backdropFilter: 'blur(16px)',
                color: isAudioPlaying ? 'rgba(255,200,120,0.95)' : 'rgba(200,180,160,0.80)',
                cursor: 'pointer',
                transition: 'all 0.35s ease',
                boxShadow: isAudioPlaying ? '0 0 20px rgba(255,130,30,0.30)' : 'none',
                marginBottom: 24,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 16,
                  animation: bellPulse ? 'pulseSlow 1.5s ease-in-out infinite' : 'none',
                }}
              >
                {isAudioPlaying ? 'volume_up' : 'volume_off'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {isAudioPlaying ? 'Spiritual Bells Active' : 'Enable Spiritual Bells'}
              </span>
              {isAudioPlaying && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#ff9933',
                  boxShadow: '0 0 8px rgba(255,153,51,0.9)',
                  display: 'inline-block',
                  animation: 'pulseSlow 1.2s ease-in-out infinite',
                }} />
              )}
            </button>
          </div>

          {/* Main heading */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.22s', opacity: 0, marginBottom: 18 }}
          >
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(36px, 7vw, 68px)',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#fff',
              textShadow: '0 4px 24px rgba(0,0,0,0.8)',
              margin: 0,
            }}>
              Experience the{' '}
              <span style={{
                background: 'linear-gradient(135deg, #ff8c00 0%, #ffb347 35%, #ffd700 60%, #ff6b00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 18px rgba(255,150,40,0.6))',
              }}>
                Soul of India
              </span>
            </h2>
          </div>

          {/* Subtitle */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.36s', opacity: 0, marginBottom: 32 }}
          >
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(14px, 2.2vw, 18px)',
              fontWeight: 400,
              lineHeight: 1.65,
              color: 'rgba(220,195,170,0.85)',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              margin: 0,
              maxWidth: 480,
            }}>
              Embark on sacred journeys, alpine exploration &amp; immersive travel experiences across India.
            </p>
          </div>

          {/* CTA Button: Explore Now */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.50s', opacity: 0 }}
          >
            <button
              id="hero-explore-btn"
              className="btn-cta-shimmer"
              onClick={() => setActiveTab('explore')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 34px',
                borderRadius: 16,
                border: '1px solid rgba(255,160,60,0.35)',
                background: 'linear-gradient(135deg, #e85d00 0%, #ff8c00 40%, #ffaa22 75%, #e07000 100%)',
                color: '#1a0800',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(255,130,20,0.55), 0 4px 20px rgba(230,90,0,0.40), inset 0 1px 0 rgba(255,220,150,0.25)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 0 45px rgba(255,140,30,0.75), 0 8px 30px rgba(230,90,0,0.55), inset 0 1px 0 rgba(255,220,150,0.25)';
                e.currentTarget.style.filter = 'brightness(1.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255,130,20,0.55), 0 4px 20px rgba(230,90,0,0.40), inset 0 1px 0 rgba(255,220,150,0.25)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>explore</span>
              Explore Now
              <span className="material-symbols-outlined" style={{ fontSize: 18, transition: 'transform 0.25s ease' }}>
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Hashtag pills */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '0.62s', opacity: 0, marginBottom: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}
        >
          {['#HimalayanSunrise', '#SacredPeaks', '#AdventureIndia'].map((tag) => (
            <span
              key={tag}
              id={`hashtag-${tag.slice(1)}`}
              className="hashtag-pill"
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(8,6,18,0.60)',
                backdropFilter: 'blur(14px)',
                color: 'rgba(210,185,155,0.75)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Glass info cards */}
        <div
          className="animate-fade-in-up w-full"
          style={{ animationDelay: '0.76s', opacity: 0 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            maxWidth: 560,
            margin: '0 auto',
          }}>
            {[
              { icon: 'groups',        value: '1000+',        label: 'Travelers',      delay: 0    },
              { icon: 'verified_user', value: 'Safety',       label: 'Assured',        delay: 0.07 },
              { icon: 'thermostat',    value: '22°C',         label: 'Live Weather',   delay: 0.14 },
              { icon: 'gpp_good',      value: 'Risk↓',        label: 'Lower Risk',     delay: 0.21 },
            ].map((card, i) => (
              <div
                key={card.icon}
                id={`info-card-${i}`}
                className="info-card"
                style={{
                  padding: '14px 8px',
                  borderRadius: 16,
                  border: '1px solid rgba(255,130,30,0.10)',
                  background: 'rgba(8, 5, 16, 0.72)',
                  backdropFilter: 'blur(22px) saturate(1.6)',
                  WebkitBackdropFilter: 'blur(22px) saturate(1.6)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  animationDelay: `${card.delay}s`,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 22,
                    color: '#ff9933',
                    filter: 'drop-shadow(0 0 6px rgba(255,153,51,0.6))',
                  }}
                >
                  {card.icon}
                </span>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.2 }}>
                  {card.value}
                </p>
                <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(190,160,130,0.70)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating AI Guide button ─────────────────────────── */}
      <button
        id="ai-chat-btn"
        onClick={() => setIsChatOpen(!isChatOpen)}
        aria-label="Open AI Travel Guide"
        style={{
          position: 'fixed', right: 20, bottom: 86, zIndex: 50,
          width: 52, height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e05a00 0%, #ff8c00 50%, #ffaa22 100%)',
          border: '1px solid rgba(255,180,80,0.35)',
          boxShadow: '0 0 22px rgba(255,120,20,0.55), 0 4px 16px rgba(200,80,0,0.40)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          color: '#1a0500',
          animation: 'glowPulse 3.5s ease-in-out infinite',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {/* Live green dot */}
        <span style={{
          position: 'absolute', top: 4, right: 4,
          width: 10, height: 10, borderRadius: '50%',
          background: '#4dff88',
          boxShadow: '0 0 8px rgba(77,255,136,0.9)',
        }} />
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
          {isChatOpen ? 'close' : 'chat_bubble'}
        </span>
      </button>

      {/* ── AI Chat panel ────────────────────────────────────── */}
      {isChatOpen && (
        <div
          className="animate-slide-up"
          style={{
            position: 'fixed', right: 16, bottom: 150, zIndex: 50,
            width: 'min(340px, calc(100vw - 32px))',
            background: 'rgba(6,4,14,0.88)',
            backdropFilter: 'blur(32px) saturate(2)',
            WebkitBackdropFilter: 'blur(32px) saturate(2)',
            border: '1px solid rgba(255,140,40,0.16)',
            borderRadius: 24,
            boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,130,30,0.08)',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            maxHeight: 440,
          }}
        >
          {/* Chat header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255,140,40,0.10)',
            background: 'linear-gradient(135deg, rgba(255,120,20,0.14) 0%, rgba(255,90,10,0.07) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#4dff88', boxShadow: '0 0 8px #4dff88', display: 'inline-block' }} />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#fff' }}>Tournet Guide AI</p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(190,160,130,0.65)' }}>Live Local Safety Monitor</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(190,160,130,0.70)', padding: 4 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            </button>
          </div>

          {/* Messages */}
          <div style={{ padding: '14px 14px 8px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                style={{
                  maxWidth: '86%',
                  padding: '9px 13px',
                  borderRadius: 16,
                  fontSize: 12,
                  lineHeight: 1.55,
                  alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
                  background: msg.sender === 'ai'
                    ? 'rgba(255,255,255,0.05)'
                    : 'linear-gradient(135deg, #e05a00, #ff9922)',
                  border: msg.sender === 'ai' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  color: msg.sender === 'ai' ? 'rgba(225,200,175,0.9)' : '#1a0500',
                  fontWeight: msg.sender === 'ai' ? 400 : 600,
                }}
              >
                {msg.text}
              </div>
            ))}
            {isAiTyping && (
              <div style={{
                alignSelf: 'flex-start', display: 'flex', gap: 5,
                padding: '10px 14px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                {[0, 0.2, 0.4].map((d, di) => (
                  <span key={di} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'rgba(200,170,140,0.60)',
                    animation: 'pulseSlow 1s ease-in-out infinite',
                    animationDelay: `${d}s`,
                    display: 'inline-block',
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div style={{
            padding: '10px 12px 14px',
            borderTop: '1px solid rgba(255,140,40,0.08)',
            background: 'rgba(0,0,0,0.22)',
            display: 'flex', flexWrap: 'wrap', gap: 7,
          }}>
            {[
              { label: '🏔️ Trek Routing', text: 'Suggest a scenic and safe trek route through the valleys' },
              { label: '🧘 Spiritual Retreats', text: 'Where are the best meditation and spiritual retreats in the Himalayas?' },
              { label: '☀️ Sunrise Points', text: 'What is the best vantage point for a Himalayan sunrise view?' },
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => handleSendMessage(q.text)}
                style={{
                  padding: '5px 11px',
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,120,30,0.08)',
                  color: 'rgba(210,180,150,0.80)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,140,40,0.35)';
                  e.currentTarget.style.color = 'rgba(255,200,130,0.95)';
                  e.currentTarget.style.background = 'rgba(255,120,30,0.16)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = 'rgba(210,180,150,0.80)';
                  e.currentTarget.style.background = 'rgba(255,120,30,0.08)';
                }}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
