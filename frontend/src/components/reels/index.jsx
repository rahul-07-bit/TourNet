// ─────────────────────────────────────────────────────────────────────────────
//  index.jsx  —  Instagram-style Reels Feed for TourNet
//
//  Features:
//    • Full-screen vertical TikTok/Instagram-style scroll
//    • Like, comment, share, bookmark actions (right sidebar)
//    • Follow button, audio ticker, location badge (bottom info)
//    • Category filter bar (top)
//    • Smooth swipe / wheel / keyboard navigation
//    • Double-tap to like with heart burst animation
//    • Premium glassmorphism UI
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { REELS_DATA, CATEGORIES } from './reelsData';

// ── Utility: format large numbers like Instagram (12.3K, 1.2M) ─────────────
function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// ── Heart burst animation component ─────────────────────────────────────────
function HeartBurst({ visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 30, pointerEvents: 'none',
    }}>
      <span style={{
        fontSize: 90, animation: 'heartBurst 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        filter: 'drop-shadow(0 0 20px rgba(255,50,100,0.9))',
      }}>❤️</span>
    </div>
  );
}

// ── Single action button (right sidebar) ────────────────────────────────────
function ActionBtn({ icon, count, active, onClick, activeColor = '#ff3568', label }) {
  const [bouncing, setBouncing] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
    onClick?.();
  };
  return (
    <button
      aria-label={label}
      onClick={handleClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
        transform: bouncing ? 'scale(1.35)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: '50%',
        background: active ? `${activeColor}22` : 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(16px)',
        border: `1.5px solid ${active ? activeColor : 'rgba(255,255,255,0.15)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: active ? `0 0 18px ${activeColor}55` : '0 2px 12px rgba(0,0,0,0.4)',
        transition: 'all 0.3s ease',
      }}>
        <span className="material-symbols-outlined" style={{
          fontSize: 22,
          color: active ? activeColor : 'rgba(255,255,255,0.9)',
          fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
          transition: 'all 0.25s ease',
        }}>{icon}</span>
      </div>
      {count !== undefined && (
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: active ? activeColor : 'rgba(255,255,255,0.8)',
          letterSpacing: '-0.02em',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
          transition: 'color 0.3s ease',
        }}>{count}</span>
      )}
    </button>
  );
}

// ── Audio ticker marquee ─────────────────────────────────────────────────────
function AudioTicker({ audio }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 20, padding: '5px 12px',
      maxWidth: '70%', overflow: 'hidden',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#ff9933', flexShrink: 0, animation: 'spin 3s linear infinite' }}>
        music_note
      </span>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{ animation: 'ticker 8s linear infinite', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
          {audio} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp; {audio}
        </div>
      </div>
    </div>
  );
}

// ── Comment Sheet (slides up from bottom) ───────────────────────────────────
function CommentSheet({ reel, onClose }) {
  const sampleComments = [
    { user: 'travel_addict_99', text: 'This is absolutely stunning! 😍🔥', time: '2h', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=c1&backgroundColor=ffdfba` },
    { user: 'wanderlust_diaries', text: 'I need to visit this place ASAP! Adding to my bucket list 📋✈️', time: '4h', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=c2&backgroundColor=b6e3f4` },
    { user: 'globe_trotter_x', text: 'The colors are unreal 🎨🌈 Nature is the best artist!', time: '6h', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=c3&backgroundColor=c0f5a9` },
    { user: 'foto.nomad', text: 'What camera settings did you use? The lighting is perfect ✨', time: '8h', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=c4&backgroundColor=ffd3e8` },
    { user: 'horizon_hunter', text: 'Currently manifesting this trip into existence 🙏🌍', time: '1d', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=c5&backgroundColor=e8d5f5` },
    { user: 'spontaneous_soul', text: 'QUITTING MY JOB AND GOING THERE TOMORROW 😤✈️', time: '1d', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=c6&backgroundColor=a9e5f5` },
  ];

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
        background: 'rgba(10,8,20,0.97)',
        backdropFilter: 'blur(40px)',
        borderTop: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '24px 24px 0 0',
        padding: '16px 0 env(safe-area-inset-bottom, 0)',
        animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        maxHeight: '75vh', display: 'flex', flexDirection: 'column',
      }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
            {formatCount(reel.comments)} Comments
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        {/* Comments list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {sampleComments.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <img src={c.avatar} alt={c.user} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(255,153,51,0.3)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{c.user}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{c.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.80)', lineHeight: 1.5 }}>{c.text}</p>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)' }}>favorite_border</span>
              </button>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#ff9933,#e05500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#fff' }}>person</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.10)', padding: '10px 16px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Add a comment…
          </div>
        </div>
      </div>
    </>
  );
}

// ── Share sheet ──────────────────────────────────────────────────────────────
function ShareSheet({ reel, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareApps = [
    { name: 'Instagram', icon: '📸', color: '#E1306C' },
    { name: 'WhatsApp', icon: '💬', color: '#25D366' },
    { name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
    { name: 'Facebook', icon: '👍', color: '#1877F2' },
    { name: 'Messages', icon: '✉️', color: '#34C759' },
    { name: 'More', icon: '⋯', color: '#8E8E8E' },
  ];
  const handleCopy = () => {
    navigator.clipboard?.writeText(`Check out this travel reel on TourNet! 🌍 #TourNet #Travel`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
        background: 'rgba(10,8,20,0.97)', backdropFilter: 'blur(40px)',
        borderTop: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '24px 24px 0 0',
        padding: '16px 20px env(safe-area-inset-bottom, 20px)',
        animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', margin: '0 auto 20px' }} />
        <p style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#fff' }}>Share to…</p>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 24 }}>
          {shareApps.map(app => (
            <button key={app.name} onClick={onClose} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: `${app.color}22`, border: `1.5px solid ${app.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {app.icon}
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{app.name}</span>
            </button>
          ))}
        </div>
        <button onClick={handleCopy} style={{ width: '100%', padding: '14px', borderRadius: 14, background: copied ? 'rgba(52,199,89,0.15)' : 'rgba(255,255,255,0.07)', border: `1.5px solid ${copied ? '#34C759' : 'rgba(255,255,255,0.12)'}`, color: copied ? '#34C759' : 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s ease' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{copied ? 'check_circle' : 'link'}</span>
          {copied ? 'Link copied!' : 'Copy link'}
        </button>
      </div>
    </>
  );
}

// ── Single Reel Card ─────────────────────────────────────────────────────────
function ReelCard({ reel, isActive, liked, saved, followed, onLike, onSave, onFollow, onComment, onShare }) {
  const [showHeart, setShowHeart]     = useState(false);
  const [localLikes, setLocalLikes]   = useState(reel.likes);
  const tapRef                        = useRef(null);

  // Double tap to like
  const handleTap = useCallback((e) => {
    e.stopPropagation();
    const now = Date.now();
    if (tapRef.current && now - tapRef.current < 320) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 750);
      if (!liked) {
        onLike(reel.id);
        setLocalLikes(prev => prev + 1);
      }
    }
    tapRef.current = now;
  }, [liked, onLike, reel.id]);

  const handleLikeBtn = (e) => {
    e.stopPropagation();
    onLike(reel.id);
    setLocalLikes(prev => liked ? prev - 1 : prev + 1);
  };

  // Gradient overlay: different hue per reel for variety
  const hues = ['#1a0000', '#00101a', '#0a0010', '#001a0a', '#1a0a00', '#10001a', '#001010', '#100a00'];
  const bgColor = hues[parseInt(reel.id.split('-')[1]) % hues.length];

  return (
    <div
      onClick={handleTap}
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        background: bgColor,
        userSelect: 'none',
      }}
    >
      {/* Background image */}
      <img
        src={reel.thumbnail}
        alt={reel.caption}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          filter: 'brightness(0.75)',
          transition: 'transform 8s ease',
          transform: isActive ? 'scale(1.04)' : 'scale(1)',
        }}
        draggable={false}
      />

      {/* Cinematic gradients */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.5) 100%)' }} />

      {/* Double-tap heart burst */}
      <HeartBurst visible={showHeart} />

      {/* ── RIGHT ACTION SIDEBAR ────────────────────────────────── */}
      <div style={{
        position: 'absolute', right: 12, bottom: 100, zIndex: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        {/* User avatar with follow ring */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <div style={{
            width: 46, height: 46, borderRadius: '50%', overflow: 'hidden',
            border: `2px solid ${followed ? '#ff9933' : 'rgba(255,255,255,0.8)'}`,
            boxShadow: followed ? '0 0 16px rgba(255,153,51,0.7)' : '0 2px 12px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
          }}>
            <img src={reel.user.avatar} alt={reel.user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Follow + button */}
          <button
            onClick={e => { e.stopPropagation(); onFollow(reel.user.username); }}
            style={{
              position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
              width: 20, height: 20, borderRadius: '50%',
              background: followed ? '#ff9933' : 'linear-gradient(135deg,#ff9933,#e05500)',
              border: '2px solid #000', color: '#fff', fontSize: 14, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(255,120,0,0.5)',
              lineHeight: 1,
            }}
          >
            {followed ? '✓' : '+'}
          </button>
        </div>

        <div style={{ marginTop: 4 }} />

        {/* Like */}
        <ActionBtn icon="favorite" count={formatCount(localLikes)} active={liked} onClick={() => handleLikeBtn({ stopPropagation: () => {} })} activeColor="#ff3568" label="Like" />

        {/* Comment */}
        <ActionBtn icon="chat_bubble" count={formatCount(reel.comments)} active={false} onClick={() => onComment(reel)} label="Comment" />

        {/* Share */}
        <ActionBtn icon="near_me" count={formatCount(reel.shares)} active={false} onClick={() => onShare(reel)} activeColor="#ff9933" label="Share" />

        {/* Bookmark */}
        <ActionBtn icon="bookmark" count={formatCount(reel.bookmarks)} active={saved} onClick={() => onSave(reel.id)} activeColor="#ff9933" label="Save" />

        {/* More options */}
        <ActionBtn icon="more_horiz" active={false} onClick={() => {}} label="More" />

        {/* Spinning vinyl disk */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
          border: '3px solid rgba(255,255,255,0.25)',
          animation: isActive ? 'spin 4s linear infinite' : 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
          marginTop: 4, flexShrink: 0,
        }}>
          <img src={reel.user.avatar} alt="audio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* ── BOTTOM INFO ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', left: 0, right: 72, bottom: 90, zIndex: 20,
        padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {/* Username + verified */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
            @{reel.user.username}
          </span>
          {reel.user.verified && (
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1DA1F2', fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 0 4px rgba(29,161,242,0.7))' }}>
              verified
            </span>
          )}
          <button
            onClick={e => { e.stopPropagation(); onFollow(reel.user.username); }}
            style={{
              padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: followed ? 'rgba(255,153,51,0.2)' : 'rgba(255,255,255,0.15)',
              border: `1px solid ${followed ? '#ff9933' : 'rgba(255,255,255,0.35)'}`,
              color: followed ? '#ff9933' : '#fff', cursor: 'pointer',
              backdropFilter: 'blur(16px)', transition: 'all 0.3s ease',
            }}
          >
            {followed ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Caption */}
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 500,
          color: 'rgba(255,255,255,0.90)', lineHeight: 1.45,
          textShadow: '0 1px 8px rgba(0,0,0,0.9)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {reel.caption}
        </p>

        {/* Location */}
        {reel.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#ff9933', fontVariationSettings: "'FILL' 1" }}>location_on</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              {reel.location}
            </span>
          </div>
        )}

        {/* Audio ticker */}
        <AudioTicker audio={reel.audio} />
      </div>
    </div>
  );
}

// ── Keyframes string ─────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes heartBurst {
    0%   { transform: scale(0); opacity: 1; }
    40%  { transform: scale(1.4); opacity: 1; }
    70%  { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1.2); opacity: 0; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes fadeInReel {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes catSlideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes swipeHint {
    0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
    50%       { transform: translateX(-50%) translateY(-6px); opacity: 1; }
  }
`;

// ── Main ReelsPage ───────────────────────────────────────────────────────────
export default function ReelsPage() {
  const [activeCategory,   setActiveCategory]   = useState('all');
  const [activeIndex,      setActiveIndex]      = useState(0);
  const [likedReels,       setLikedReels]       = useState(new Set());
  const [savedReels,       setSavedReels]       = useState(new Set());
  const [followedCreators, setFollowedCreators] = useState(new Set());
  const [commentReel,      setCommentReel]      = useState(null);
  const [shareReel,        setShareReel]        = useState(null);
  const [isDragging,       setIsDragging]       = useState(false);
  const [dragStartY,       setDragStartY]       = useState(0);
  const [translateY,       setTranslateY]       = useState(0);
  const [isTransitioning,  setIsTransitioning]  = useState(false);

  const containerRef = useRef(null);

  // ── Filter reels ─────────────────────────────────────────────────────────
  const filteredReels = useMemo(
    () => activeCategory === 'all' ? REELS_DATA : REELS_DATA.filter(r => r.category === activeCategory),
    [activeCategory]
  );

  useEffect(() => { setActiveIndex(0); }, [activeCategory]);

  // ── Navigation ───────────────────────────────────────────────────────────
  const goToReel = useCallback((newIndex) => {
    if (isTransitioning || commentReel || shareReel) return;
    const clamped = Math.max(0, Math.min(newIndex, filteredReels.length - 1));
    if (clamped === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(clamped);
    setTimeout(() => setIsTransitioning(false), 450);
  }, [isTransitioning, activeIndex, filteredReels.length, commentReel, shareReel]);

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'j') goToReel(activeIndex + 1);
      if (e.key === 'ArrowUp'   || e.key === 'k') goToReel(activeIndex - 1);
      if (e.key === 'Escape') { setCommentReel(null); setShareReel(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToReel, activeIndex]);

  // Mouse wheel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timer;
    const onWheel = (e) => {
      e.preventDefault();
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (e.deltaY > 50)  goToReel(activeIndex + 1);
        if (e.deltaY < -50) goToReel(activeIndex - 1);
      }, 60);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [goToReel, activeIndex]);

  // Touch swipe
  const handlePointerDown = useCallback((e) => {
    if (commentReel || shareReel) return;
    setIsDragging(true);
    setDragStartY(e.clientY ?? e.touches?.[0]?.clientY ?? 0);
    setTranslateY(0);
  }, [commentReel, shareReel]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    setTranslateY(Math.sign(y - dragStartY) * Math.min(Math.abs(y - dragStartY), 110) * 0.3);
  }, [isDragging, dragStartY]);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const y = e.clientY ?? e.changedTouches?.[0]?.clientY ?? 0;
    setTranslateY(0);
    if (dragStartY - y > 70) goToReel(activeIndex + 1);
    if (y - dragStartY > 70) goToReel(activeIndex - 1);
  }, [isDragging, dragStartY, goToReel, activeIndex]);

  // ── Interaction handlers ─────────────────────────────────────────────────
  const handleLike   = useCallback((id) => setLikedReels(prev   => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const handleSave   = useCallback((id) => setSavedReels(prev   => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const handleFollow = useCallback((name) => setFollowedCreators(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; }), []);

  const currentReel = filteredReels[activeIndex];

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#000', overflow: 'hidden', userSelect: 'none', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      <style>{KEYFRAMES}</style>

      {/* ── CURRENT REEL ───────────────────────────────────────── */}
      {currentReel && (
        <div
          key={currentReel.id}
          style={{
            position: 'absolute', inset: 0,
            transform: `translateY(${translateY}px)`,
            transition: isDragging ? 'none' : 'transform 0.25s ease',
            animation: 'fadeInReel 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          <ReelCard
            reel={currentReel}
            isActive={true}
            liked={likedReels.has(currentReel.id)}
            saved={savedReels.has(currentReel.id)}
            followed={followedCreators.has(currentReel.user.username)}
            onLike={handleLike}
            onSave={handleSave}
            onFollow={handleFollow}
            onComment={setCommentReel}
            onShare={setShareReel}
          />
        </div>
      )}

      {/* Empty state */}
      {filteredReels.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'rgba(255,153,51,0.4)' }}>movie_filter</span>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: 600 }}>No reels in this category</p>
          <button onClick={() => setActiveCategory('all')} style={{ padding: '10px 24px', borderRadius: 20, background: 'linear-gradient(135deg,#ff9933,#e05500)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            Explore All
          </button>
        </div>
      )}

      {/* ── TOP: Category filter bar ────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, transparent 100%)',
        animation: 'catSlideDown 0.4s ease forwards',
      }}>
        {/* Top bar: logo + search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#ff9933', fontVariationSettings: "'FILL' 1" }}>explore</span>
            <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Reels</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={e => e.stopPropagation()} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)' }}>search</span>
            </button>
            <button onClick={e => e.stopPropagation()} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)' }}>add</span>
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 16px 14px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={e => { e.stopPropagation(); setActiveCategory(cat.id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 24, border: 'none', flexShrink: 0,
                  background: isActive ? 'linear-gradient(135deg,#ff9933,#e05500)' : 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(20px)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.70)',
                  fontSize: 12, fontWeight: isActive ? 700 : 500,
                  boxShadow: isActive ? '0 4px 16px rgba(255,100,0,0.45)' : 'none',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT: Progress indicator dots ─────────────────────── */}
      {filteredReels.length > 1 && (
        <div style={{
          position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 4,
          zIndex: 25, maxHeight: '40vh', overflow: 'hidden',
        }}>
          {filteredReels
            .slice(Math.max(0, activeIndex - 4), Math.min(filteredReels.length, activeIndex + 5))
            .map((r, i) => {
              const gIdx   = Math.max(0, activeIndex - 4) + i;
              const isCurr = gIdx === activeIndex;
              return (
                <div
                  key={r.id}
                  onClick={e => { e.stopPropagation(); goToReel(gIdx); }}
                  style={{
                    width: isCurr ? 4 : 3,
                    height: isCurr ? 22 : 6,
                    borderRadius: 3,
                    background: isCurr ? '#ff9933' : 'rgba(255,255,255,0.28)',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: isCurr ? '0 0 10px rgba(255,153,51,0.8)' : 'none',
                  }}
                />
              );
            })}
        </div>
      )}

      {/* ── BOTTOM: Swipe hint + reel counter ──────────────────── */}
      {activeIndex === 0 && filteredReels.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 84, left: '50%',
          transform: 'translateX(-50%)', zIndex: 25,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          pointerEvents: 'none', animation: 'swipeHint 1.5s ease-in-out infinite',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)' }}>keyboard_arrow_up</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.08em', fontWeight: 600 }}>SWIPE UP</span>
        </div>
      )}

      {/* Reel counter badge */}
      <div style={{
        position: 'absolute', bottom: 88, right: 18, zIndex: 25,
        background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20,
        padding: '4px 10px', fontSize: 11, fontWeight: 700,
        color: 'rgba(255,255,255,0.55)',
      }}>
        {activeIndex + 1} / {filteredReels.length}
      </div>

      {/* ── MODALS ──────────────────────────────────────────────── */}
      {commentReel && (
        <CommentSheet reel={commentReel} onClose={() => setCommentReel(null)} />
      )}
      {shareReel && (
        <ShareSheet reel={shareReel} onClose={() => setShareReel(null)} />
      )}
    </div>
  );
}
