/**
 * ReelsPage.jsx — TourNet Full-Screen Instagram-style Reels Experience
 *
 * Features:
 * - Full-screen vertical reels with swipe up/down navigation
 * - Auto-play, pause on blur, infinite scroll
 * - Right-side action bar: Like, Comment, Share, Save, Follow
 * - Bottom info panel: creator, title, description, location, hashtags
 * - TourNet-specific: Explore CTA, Map, Distance, Weather, Safety, Crowd level
 * - Content categories: Spiritual, Himalayan, Temple, Villages, etc.
 * - Double-tap to like with floating heart animation
 * - Skeleton loading, lazy loading, smooth transitions
 * - Dark premium theme with saffron/gold accents
 */

import React, {
  useState, useEffect, useRef, useCallback, useMemo
} from 'react';

// ─── MOCK REELS DATA ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',       label: 'All',              icon: 'grid_view' },
  { id: 'spiritual', label: 'Spiritual India',  icon: 'auto_awesome' },
  { id: 'himalayan', label: 'Himalayan',        icon: 'landscape' },
  { id: 'temple',    label: 'Temple Trails',    icon: 'temple_hindu' },
  { id: 'village',   label: 'Hidden Villages',  icon: 'cottage' },
  { id: 'heritage',  label: 'Heritage Walks',   icon: 'account_balance' },
  { id: 'food',      label: 'Local Food',       icon: 'restaurant' },
  { id: 'festival',  label: 'Festivals',        icon: 'celebration' },
  { id: 'river',     label: 'River Journeys',   icon: 'water' },
  { id: 'wildlife',  label: 'Wildlife',         icon: 'pets' },
];

const REELS_DATA = [
  {
    id: 'r1',
    category: 'spiritual',
    title: 'Sacred Ganga Aarti at Dawn',
    description: 'Witness the most mesmerizing aarti ceremony as 108 priests light diyas in perfect synchrony along the ghats of Varanasi.',
    location: 'Dashashwamedh Ghat, Varanasi',
    hashtags: ['#GangaAarti', '#Varanasi', '#SpiritualIndia', '#Kashi', '#HolyCity'],
    creator: { name: 'Arjun Sharma', avatar: null, followers: '128K', isVerified: true },
    stats: { likes: 84200, comments: 1240, shares: 3600, saves: 5100, views: 420000 },
    duration: '0:58',
    distance: '812 km away',
    weather: '28°C · Clear',
    season: 'Oct – Mar',
    safety: 4.8,
    crowd: 'high',
    nearbyAttractions: ['Kashi Vishwanath', 'Sarnath', 'Ramnagar Fort'],
    gradient: 'from-orange-900 via-red-900 to-amber-900',
    accentColor: '#ff9933',
    bgPattern: 'spiritual',
    videoUrl: null,
  },
  {
    id: 'r2',
    category: 'himalayan',
    title: 'Hidden Azure Canyons of Ladakh',
    description: 'A solo trek through the surreal moon-like landscapes of Zanskar Valley, where silence speaks louder than words.',
    location: 'Zanskar Valley, Ladakh',
    hashtags: ['#Ladakh', '#Himalayan', '#Zanskar', '#IncredibleIndia', '#TrekLife'],
    creator: { name: 'Priya Nair', avatar: null, followers: '245K', isVerified: true },
    stats: { likes: 127400, comments: 2180, shares: 8900, saves: 14200, views: 980000 },
    duration: '1:12',
    distance: '1,240 km away',
    weather: '−2°C · Sunny',
    season: 'Jun – Sep',
    safety: 4.2,
    crowd: 'low',
    nearbyAttractions: ['Pangong Lake', 'Nubra Valley', 'Thiksey Monastery'],
    gradient: 'from-blue-900 via-slate-900 to-indigo-900',
    accentColor: '#60a5fa',
    bgPattern: 'himalayan',
    videoUrl: null,
  },
  {
    id: 'r3',
    category: 'temple',
    title: 'The Golden Temple at Sunrise',
    description: 'Standing at the edge of Sarovar, as the first light of dawn bathes Harmandir Sahib in liquid gold.',
    location: 'Harmandir Sahib, Amritsar',
    hashtags: ['#GoldenTemple', '#Amritsar', '#Sikhism', '#PunjabDiaries', '#Serenity'],
    creator: { name: 'Gurpreet Singh', avatar: null, followers: '89K', isVerified: false },
    stats: { likes: 203100, comments: 4560, shares: 12400, saves: 22800, views: 1200000 },
    duration: '0:45',
    distance: '448 km away',
    weather: '22°C · Partly Cloudy',
    season: 'Nov – Mar',
    safety: 5.0,
    crowd: 'medium',
    nearbyAttractions: ['Jallianwala Bagh', 'Wagah Border', 'Durgiana Temple'],
    gradient: 'from-amber-900 via-yellow-900 to-orange-900',
    accentColor: '#fbbf24',
    bgPattern: 'temple',
    videoUrl: null,
  },
  {
    id: 'r4',
    category: 'village',
    title: 'Floating Village of Dal Lake',
    description: 'Life on water — families who have lived for generations on houseboats, with gardens that literally float.',
    location: 'Dal Lake, Srinagar',
    hashtags: ['#DalLake', '#Kashmir', '#HouseBoat', '#HiddenGem', '#NorthIndia'],
    creator: { name: 'Zara Mirza', avatar: null, followers: '56K', isVerified: false },
    stats: { likes: 45600, comments: 890, shares: 2100, saves: 6700, views: 340000 },
    duration: '1:30',
    distance: '978 km away',
    weather: '18°C · Clear',
    season: 'Apr – Oct',
    safety: 4.5,
    crowd: 'low',
    nearbyAttractions: ['Gulmarg', 'Pahalgam', 'Mughal Gardens'],
    gradient: 'from-teal-900 via-cyan-900 to-blue-900',
    accentColor: '#2dd4bf',
    bgPattern: 'village',
    videoUrl: null,
  },
  {
    id: 'r5',
    category: 'heritage',
    title: 'Stepwells of Rajasthan',
    description: 'Lost in the geometric symmetry of Chand Baori — 3,500 steps descending into another world, another century.',
    location: 'Chand Baori, Abhaneri',
    hashtags: ['#ChandBaori', '#Rajasthan', '#Heritage', '#Architecture', '#HiddenIndia'],
    creator: { name: 'Meera Kapoor', avatar: null, followers: '178K', isVerified: true },
    stats: { likes: 91300, comments: 1670, shares: 7200, saves: 11400, views: 720000 },
    duration: '0:52',
    distance: '287 km away',
    weather: '35°C · Hot & Dry',
    season: 'Oct – Feb',
    safety: 4.6,
    crowd: 'low',
    nearbyAttractions: ['Jaipur', 'Ranthambore', 'Fatehpur Sikri'],
    gradient: 'from-rose-900 via-pink-900 to-red-900',
    accentColor: '#fb7185',
    bgPattern: 'heritage',
    videoUrl: null,
  },
  {
    id: 'r6',
    category: 'food',
    title: 'Street Food of Old Delhi',
    description: "From Paranthe Wali Gali to Jama Masjid's nihari — a sensory explosion through 400 years of Mughal cuisine.",
    location: 'Chandni Chowk, Old Delhi',
    hashtags: ['#OldDelhi', '#StreetFood', '#MughalCuisine', '#FoodTrail', '#DelhiDiaries'],
    creator: { name: 'Rohit Chawla', avatar: null, followers: '312K', isVerified: true },
    stats: { likes: 156700, comments: 3890, shares: 9800, saves: 18300, views: 890000 },
    duration: '1:45',
    distance: '0 km · Delhi',
    weather: '32°C · Hazy',
    season: 'Oct – Feb',
    safety: 4.3,
    crowd: 'high',
    nearbyAttractions: ['Red Fort', 'Humayun\'s Tomb', 'Qutub Minar'],
    gradient: 'from-green-900 via-emerald-900 to-teal-900',
    accentColor: '#34d399',
    bgPattern: 'food',
    videoUrl: null,
  },
  {
    id: 'r7',
    category: 'festival',
    title: 'Colours of Pushkar Camel Fair',
    description: 'Half a million souls descend on a tiny desert town — camels, turbans, folk music, and a sky full of kites.',
    location: 'Pushkar, Rajasthan',
    hashtags: ['#PushkarFair', '#CamelFair', '#Rajasthan', '#Festival', '#DesertLife'],
    creator: { name: 'Divya Singhvi', avatar: null, followers: '94K', isVerified: false },
    stats: { likes: 73400, comments: 1340, shares: 5600, saves: 8900, views: 560000 },
    duration: '1:08',
    distance: '405 km away',
    weather: '26°C · Dry',
    season: 'Nov (Festival)',
    safety: 4.4,
    crowd: 'high',
    nearbyAttractions: ['Ajmer Dargah', 'Brahma Temple', 'Ana Sagar Lake'],
    gradient: 'from-purple-900 via-violet-900 to-fuchsia-900',
    accentColor: '#c084fc',
    bgPattern: 'festival',
    videoUrl: null,
  },
  {
    id: 'r8',
    category: 'river',
    title: 'Kerala Backwaters at Dusk',
    description: 'Gliding through the labyrinth of canals as the sun melts into the horizon — pure, unhurried serenity.',
    location: 'Alleppey Backwaters, Kerala',
    hashtags: ['#Kerala', '#Backwaters', '#Alleppey', '#GodSOwn', '#HouseBoat'],
    creator: { name: 'Ananya Menon', avatar: null, followers: '203K', isVerified: true },
    stats: { likes: 118900, comments: 2340, shares: 6700, saves: 16200, views: 780000 },
    duration: '1:20',
    distance: '2,100 km away',
    weather: '29°C · Humid',
    season: 'Oct – Mar',
    safety: 4.9,
    crowd: 'medium',
    nearbyAttractions: ['Vembanad Lake', 'Kumarakom', 'Kottayam'],
    gradient: 'from-emerald-900 via-green-900 to-lime-900',
    accentColor: '#6ee7b7',
    bgPattern: 'river',
    videoUrl: null,
  },
  {
    id: 'r9',
    category: 'wildlife',
    title: 'Tiger Spotted at Ranthambore',
    description: 'An ancient tigress emerges from the ruins of a 10th-century fort — nature reclaiming history.',
    location: 'Ranthambore National Park, Rajasthan',
    hashtags: ['#Tiger', '#Ranthambore', '#Wildlife', '#WildIndia', '#ProjectTiger'],
    creator: { name: 'Vikram Rao', avatar: null, followers: '441K', isVerified: true },
    stats: { likes: 342000, comments: 8910, shares: 24600, saves: 38400, views: 2800000 },
    duration: '0:38',
    distance: '337 km away',
    weather: '31°C · Clear',
    season: 'Oct – Jun',
    safety: 4.7,
    crowd: 'medium',
    nearbyAttractions: ['Sariska Tiger Reserve', 'Keoladeo Bird Sanctuary', 'Bundi'],
    gradient: 'from-yellow-900 via-amber-900 to-orange-900',
    accentColor: '#f59e0b',
    bgPattern: 'wildlife',
    videoUrl: null,
  },
  {
    id: 'r10',
    category: 'himalayan',
    title: 'Spiti Valley in Winter Snow',
    description: 'Cut off from the world for 6 months each year, Spiti exists in a silent, snow-draped parallel universe.',
    location: 'Key Monastery, Spiti Valley, HP',
    hashtags: ['#Spiti', '#HimachalPradesh', '#SnowBound', '#Monastery', '#OffBeat'],
    creator: { name: 'Kabir Thakur', avatar: null, followers: '167K', isVerified: true },
    stats: { likes: 89200, comments: 1890, shares: 6400, saves: 12700, views: 620000 },
    duration: '1:55',
    distance: '534 km away',
    weather: '−15°C · Snowfall',
    season: 'Mar – Jun',
    safety: 3.8,
    crowd: 'low',
    nearbyAttractions: ['Chandratal Lake', 'Pin Valley', 'Tabo Monastery'],
    gradient: 'from-sky-900 via-blue-900 to-indigo-900',
    accentColor: '#38bdf8',
    bgPattern: 'himalayan',
    videoUrl: null,
  },
];

// ─── VISUAL PATTERN BACKGROUNDS ─────────────────────────────────────────────
function ReelBackground({ reel, isActive }) {
  const patterns = {
    spiritual: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a0a00 0%, #3d1200 30%, #1a0500 70%, #0d0300 100%)' }} />
        {/* Flame particles */}
        {isActive && Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            bottom: `${10 + Math.random() * 30}%`,
            left: `${10 + i * 7}%`,
            width: 4, height: `${20 + Math.random() * 40}px`,
            background: `radial-gradient(ellipse, #ff9933 0%, #ff6600 40%, transparent 100%)`,
            borderRadius: '50% 50% 30% 30%',
            opacity: 0.7,
            animation: `reelFlicker ${1.5 + Math.random()}s ease-in-out infinite ${Math.random()}s`,
          }} />
        ))}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,100,10,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '30%', left: '50%', transform: 'translateX(-50%)', fontSize: 200, opacity: 0.04, color: '#ff9933', lineHeight: 1 }}>🕉</div>
      </div>
    ),
    himalayan: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, #020b1a 0%, #05142e 30%, #0a1628 70%, #060d1f 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(2,8,20,0.9))' }} />
        {/* Stars */}
        {isActive && Array.from({ length: 60 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() < 0.3 ? 3 : 2,
            height: Math.random() < 0.3 ? 3 : 2,
            borderRadius: '50%',
            background: '#fff',
            opacity: 0.4 + Math.random() * 0.6,
            animation: `reelTwinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 3}s`,
          }} />
        ))}
        {/* Mountain silhouettes */}
        <svg style={{ position: 'absolute', bottom: '25%', width: '100%', opacity: 0.25 }} viewBox="0 0 400 200" preserveAspectRatio="none">
          <polygon points="0,200 80,60 160,140 200,20 260,100 320,50 400,200" fill="#1e40af" />
          <polygon points="0,200 60,90 120,160 180,40 240,120 300,70 360,130 400,200" fill="#1d4ed8" opacity="0.5" />
        </svg>
      </div>
    ),
    temple: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #1a1000 0%, #2d1c00 30%, #1a1200 70%, #0d0800 100%)' }} />
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', fontSize: 220, opacity: 0.03, color: '#fbbf24', lineHeight: 1 }}>☸</div>
      </div>
    ),
    village: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(150deg, #001a1a 0%, #002d2d 30%, #001515 70%, #000d0d 100%)' }} />
        <div style={{ position: 'absolute', top: '25%', right: '20%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 70%)' }} />
      </div>
    ),
    heritage: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #1a0010 0%, #2d0020 30%, #150010 70%, #0a0008 100%)' }} />
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,113,133,0.10) 0%, transparent 65%)' }} />
      </div>
    ),
    food: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(140deg, #001a08 0%, #002d10 30%, #001408 70%, #000d04 100%)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 65%)' }} />
      </div>
    ),
    festival: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, #0f001a 0%, #1a002d 30%, #100015 70%, #08000d 100%)' }} />
        {isActive && Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: 6, height: 6,
            borderRadius: '50%',
            background: ['#c084fc', '#f472b6', '#fb923c', '#fbbf24', '#34d399'][i % 5],
            opacity: 0.6,
            animation: `reelFloat ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 4}s`,
          }} />
        ))}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 65%)' }} />
      </div>
    ),
    river: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, #001a10 0%, #002d1a 30%, #001510 70%, #000d08 100%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, height: 120, background: 'linear-gradient(to top, rgba(110,231,183,0.08), transparent)', borderRadius: '50% 50% 0 0 / 20px 20px 0 0' }} />
      </div>
    ),
    wildlife: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg, #1a0f00 0%, #2d1c00 30%, #150f00 70%, #0a0800 100%)' }} />
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 65%)' }} />
        {/* Grass silhouettes */}
        <div style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, height: 80, overflow: 'hidden' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', bottom: 0,
              left: `${i * 3.5}%`,
              width: 3,
              height: `${20 + Math.random() * 40}px`,
              background: 'rgba(180,130,30,0.15)',
              borderRadius: '2px 2px 0 0',
              transformOrigin: 'bottom center',
              animation: `reelGrass ${2 + Math.random() * 2}s ease-in-out infinite ${Math.random()}s`,
            }} />
          ))}
        </div>
      </div>
    ),
  };

  return patterns[reel.bgPattern] || patterns.spiritual;
}

// ─── FLOATING HEART ANIMATION ───────────────────────────────────────────────
function FloatingHeart({ x, y, id, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: 'absolute', left: x - 20, top: y - 20,
      pointerEvents: 'none', zIndex: 999,
      fontSize: 40, animation: 'reelHeartFloat 1.2s ease-out forwards',
    }}>❤️</div>
  );
}

// ─── SKELETON LOADER ─────────────────────────────────────────────────────────
function ReelSkeleton() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#08030e' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,153,51,0.05) 50%, transparent 100%)', animation: 'reelSkeleton 1.6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: 120, left: 20, right: 80 }}>
        <div style={{ height: 12, width: 60, borderRadius: 6, background: 'rgba(255,255,255,0.08)', marginBottom: 10 }} />
        <div style={{ height: 22, width: '80%', borderRadius: 6, background: 'rgba(255,255,255,0.12)', marginBottom: 8 }} />
        <div style={{ height: 14, width: '60%', borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 100, right: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[48, 48, 48, 48].map((s, i) => (
          <div key={i} style={{ width: s, height: s, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
    </div>
  );
}

// ─── CROWD LEVEL INDICATOR ───────────────────────────────────────────────────
function CrowdIndicator({ level }) {
  const colors = { low: '#34d399', medium: '#fbbf24', high: '#fb7185' };
  const labels = { low: 'Quiet', medium: 'Moderate', high: 'Busy' };
  const counts = { low: 1, medium: 2, high: 3 };
  const color = colors[level] || '#fbbf24';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: i < counts[level] ? color : 'rgba(255,255,255,0.15)',
        }} />
      ))}
      <span style={{ fontSize: 11, color, marginLeft: 2, fontWeight: 600 }}>{labels[level]}</span>
    </div>
  );
}

// ─── SAFETY STARS ────────────────────────────────────────────────────────────
function SafetyRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="material-symbols-outlined" style={{
          fontSize: 12,
          color: i < Math.floor(rating) ? '#ff9933' : 'rgba(255,255,255,0.2)',
          fontVariationSettings: "'FILL' 1",
        }}>star</span>
      ))}
      <span style={{ fontSize: 11, color: 'rgba(255,220,150,0.8)', marginLeft: 2 }}>{rating}</span>
    </div>
  );
}

// ─── FORMAT NUMBERS ──────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// ─── COMMENT MODAL ───────────────────────────────────────────────────────────
function CommentModal({ reel, onClose }) {
  const [text, setText] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'travel_soul_99', text: 'This place is on my bucket list! 🙏', likes: 42 },
    { id: 2, user: 'wanderlust_india', text: 'Visited last November, absolutely life-changing experience!', likes: 28 },
    { id: 3, user: 'desi_explorer', text: 'Which is the best time to visit? Planning a trip 🗺️', likes: 15 },
    { id: 4, user: 'mountainheart', text: 'The colors, the energy... incredible 🔥', likes: 67 },
    { id: 5, user: 'sacred_journeys', text: `${reel.creator.name} amazing reel! Keep it up 🌟`, likes: 33 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setComments(c => [{ id: Date.now(), user: 'You', text, likes: 0 }, ...c]);
      setText('');
      setSubmitting(false);
    }, 400);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', zIndex: 1,
          background: 'rgba(12,6,24,0.97)',
          backdropFilter: 'blur(40px)',
          borderTop: '1px solid rgba(255,153,51,0.18)',
          borderRadius: '24px 24px 0 0',
          maxHeight: '70vh', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
        </div>
        <div style={{ padding: '4px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{fmt(reel.stats.comments + comments.length - 5)} Comments</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {comments.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #ff9933, #cc5500)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                {c.user[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,200,150,0.9)' }}>{c.user}</span>
                  {c.user === 'You' && <span style={{ fontSize: 9, background: 'rgba(255,153,51,0.2)', color: '#ff9933', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>YOU</span>}
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.4 }}>{c.text}</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>2h ago</span>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: 11, padding: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>favorite_border</span>
                    {c.likes > 0 && c.likes}
                  </button>
                  <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 11, padding: 0 }}>Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <div style={{ padding: '12px 20px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #ff9933, #cc5500)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>Y</div>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Add a comment…"
            style={{
              flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 20, padding: '8px 16px', color: '#fff', fontSize: 14, outline: 'none',
            }}
          />
          <button
            onClick={submit}
            disabled={!text.trim() || submitting}
            style={{
              background: text.trim() ? 'linear-gradient(135deg, #ff9933, #e05500)' : 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: '50%', width: 36, height: 36,
              color: text.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
              cursor: text.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── INFO PANEL (bottom slide-up) ────────────────────────────────────────────
function InfoPanel({ reel, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} />
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(10,4,20,0.98)',
        backdropFilter: 'blur(40px)',
        borderTop: '1px solid rgba(255,153,51,0.20)',
        borderRadius: '24px 24px 0 0',
        padding: '16px 20px 40px',
        maxHeight: '80vh', overflowY: 'auto',
        animation: 'reelSlideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0 }}>Destination Details</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span className="material-symbols-outlined" style={{ color: '#ff9933', fontSize: 20, fontVariationSettings: "'FILL' 1" }}>location_on</span>
          <span style={{ color: 'rgba(255,220,150,0.9)', fontWeight: 600 }}>{reel.location}</span>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { icon: 'near_me', label: 'Distance', value: reel.distance, color: '#60a5fa' },
            { icon: 'wb_sunny', label: 'Weather', value: reel.weather, color: '#fbbf24' },
            { icon: 'calendar_month', label: 'Best Season', value: reel.season, color: '#34d399' },
            { icon: 'security', label: 'Safety Rating', value: null, component: <SafetyRating rating={reel.safety} />, color: '#ff9933' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 14px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
              </div>
              {item.component || <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{item.value}</span>}
            </div>
          ))}
        </div>

        {/* Crowd */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#c084fc', fontVariationSettings: "'FILL' 1" }}>groups</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Crowd Level</span>
          </div>
          <CrowdIndicator level={reel.crowd} />
        </div>

        {/* Nearby attractions */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Nearby Attractions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reel.nearbyAttractions.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#ff9933' }}>place</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{a}</span>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>chevron_right</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => alert(`Exploring ${reel.location}! 🗺️`)}
            style={{
              flex: 1, padding: '14px', borderRadius: 16,
              background: 'linear-gradient(135deg, #ff9933 0%, #e05500 100%)',
              border: 'none', color: '#fff', fontWeight: 800, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 8px 32px rgba(255,100,0,0.45)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>explore</span>
            Explore This Place
          </button>
          <button
            onClick={() => alert(`Opening map for ${reel.location}! 🗺️`)}
            style={{
              padding: '14px 18px', borderRadius: 16,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>map</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SINGLE REEL CARD ────────────────────────────────────────────────────────
function ReelCard({
  reel, isActive, onLike, onComment, onShare, onSave, onFollow,
  likedReels, savedReels, followedCreators,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const lastTapRef = useRef(0);
  const cardRef = useRef(null);

  const isLiked = likedReels.has(reel.id);
  const isSaved = savedReels.has(reel.id);
  const isFollowed = followedCreators.has(reel.creator.name);

  // Simulate loading
  useEffect(() => {
    if (isActive) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 600 + Math.random() * 400);
      return () => clearTimeout(t);
    }
  }, [isActive, reel.id]);

  // Simulate progress bar
  useEffect(() => {
    if (!isActive || loading) { setProgress(0); return; }
    let p = 0;
    const dur = parseFloat(reel.duration.replace(':', '.')) * 60 * 1000;
    const interval = 100;
    const step = (interval / dur) * 100;
    progressRef.current = setInterval(() => {
      p = Math.min(p + step, 100);
      setProgress(p);
      if (p >= 100) { clearInterval(progressRef.current); setTimeout(() => setProgress(0), 500); }
    }, interval);
    return () => clearInterval(progressRef.current);
  }, [isActive, loading, reel.duration]);

  // Double-tap to like
  const handleTap = useCallback((e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const heartId = Date.now();
        setFloatingHearts(h => [...h, { id: heartId, x, y }]);
        onLike(reel.id);
      }
    }
    lastTapRef.current = now;
  }, [onLike, reel.id]);

  const accentRgb = reel.accentColor;

  return (
    <div
      ref={cardRef}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', cursor: 'pointer' }}
      onClick={handleTap}
    >
      {/* Background */}
      <ReelBackground reel={reel} isActive={isActive} />

      {/* Skeleton or content */}
      {loading && isActive ? (
        <ReelSkeleton />
      ) : (
        <>
          {/* Gradient overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 35%, transparent 65%, rgba(0,0,0,0.3) 100%)', zIndex: 2 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 55%, rgba(0,0,0,0.4) 100%)', zIndex: 2 }} />

          {/* Floating hearts */}
          {floatingHearts.map(h => (
            <FloatingHeart key={h.id} x={h.x} y={h.y} id={h.id} onDone={() => setFloatingHearts(prev => prev.filter(fh => fh.id !== h.id))} />
          ))}

          {/* ── TOP BAR ── */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, padding: '52px 16px 16px' }}>
            {/* Progress bar */}
            <div style={{ height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 2, marginBottom: 14 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, #ff9933, ${accentRgb})`, borderRadius: 2, transition: 'width 0.1s linear', boxShadow: `0 0 8px ${accentRgb}` }} />
            </div>
            {/* Category badge */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                background: `rgba(255,255,255,0.12)`,
                backdropFilter: 'blur(16px)',
                border: `1px solid ${accentRgb}33`,
                borderRadius: 20, padding: '4px 12px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: accentRgb, fontVariationSettings: "'FILL' 1" }}>
                  {CATEGORIES.find(c => c.id === reel.category)?.icon || 'category'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {CATEGORIES.find(c => c.id === reel.category)?.label}
                </span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: '4px 10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>visibility</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{fmt(reel.stats.views)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', borderRadius: 20, padding: '4px 10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>schedule</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{reel.duration}</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT ACTION BAR ── */}
          <div style={{
            position: 'absolute', right: 12, bottom: 160, zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          }}>
            {/* Creator avatar + follow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: `linear-gradient(135deg, ${accentRgb}, #4c2700)`,
                border: `2px solid ${accentRgb}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: '#fff',
                boxShadow: `0 0 16px ${accentRgb}55`,
              }}>
                {reel.creator.name[0]}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onFollow(reel.creator.name); }}
                style={{
                  width: 22, height: 22, borderRadius: '50%', marginTop: -10,
                  background: isFollowed ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #ff9933, #e05500)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#fff', fontVariationSettings: "'FILL' 1" }}>
                  {isFollowed ? 'check' : 'add'}
                </span>
              </button>
            </div>

            {/* Like */}
            <ActionButton
              icon={isLiked ? 'favorite' : 'favorite_border'}
              label={fmt(reel.stats.likes + (isLiked ? 1 : 0))}
              color={isLiked ? '#fb7185' : 'rgba(255,255,255,0.9)'}
              glow={isLiked ? 'rgba(251,113,133,0.4)' : 'none'}
              pulse={isLiked}
              onClick={(e) => { e.stopPropagation(); onLike(reel.id); }}
            />

            {/* Comment */}
            <ActionButton
              icon="mode_comment"
              label={fmt(reel.stats.comments)}
              color="rgba(255,255,255,0.9)"
              onClick={(e) => { e.stopPropagation(); setShowComment(true); }}
            />

            {/* Share */}
            <ActionButton
              icon="share"
              label={fmt(reel.stats.shares)}
              color="rgba(255,255,255,0.9)"
              onClick={(e) => { e.stopPropagation(); onShare(reel.id); }}
            />

            {/* Save / Bookmark */}
            <ActionButton
              icon={isSaved ? 'bookmark' : 'bookmark_border'}
              label={fmt(reel.stats.saves + (isSaved ? 1 : 0))}
              color={isSaved ? accentRgb : 'rgba(255,255,255,0.9)'}
              glow={isSaved ? `${accentRgb}55` : 'none'}
              onClick={(e) => { e.stopPropagation(); onSave(reel.id); }}
            />

            {/* Info / Destination */}
            <ActionButton
              icon="info"
              label="Info"
              color="rgba(255,255,255,0.9)"
              onClick={(e) => { e.stopPropagation(); setShowInfo(true); }}
            />
          </div>

          {/* ── BOTTOM INFO PANEL ── */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 80, zIndex: 10, padding: '0 16px 28px' }}>
            {/* Creator row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `linear-gradient(135deg, ${accentRgb}, #4c2700)`,
                border: `1.5px solid ${accentRgb}66`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 800, color: '#fff',
              }}>
                {reel.creator.name[0]}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>@{reel.creator.name.toLowerCase().replace(' ', '_')}</span>
                  {reel.creator.isVerified && (
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#60a5fa', fontVariationSettings: "'FILL' 1" }}>verified</span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{reel.creator.followers} followers</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onFollow(reel.creator.name); }}
                style={{
                  marginLeft: 'auto', padding: '6px 14px', borderRadius: 20,
                  background: isFollowed ? 'rgba(255,255,255,0.1)' : 'rgba(255,153,51,0.2)',
                  border: `1px solid ${isFollowed ? 'rgba(255,255,255,0.15)' : 'rgba(255,153,51,0.4)'}`,
                  color: isFollowed ? 'rgba(255,255,255,0.6)' : '#ff9933',
                  cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  transition: 'all 0.3s ease',
                }}
              >
                {isFollowed ? '✓ Following' : '+ Follow'}
              </button>
            </div>

            {/* Title */}
            <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 18, margin: '0 0 6px', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              {reel.title}
            </h3>

            {/* Description */}
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: '0 0 10px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {reel.description}
            </p>

            {/* Location tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: accentRgb, fontVariationSettings: "'FILL' 1" }}>location_on</span>
              <span style={{ fontSize: 12, color: 'rgba(255,220,150,0.85)', fontWeight: 600 }}>{reel.location}</span>
            </div>

            {/* Hashtags */}
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, overflowX: 'auto', marginBottom: 12 }}>
              {reel.hashtags.map(tag => (
                <span key={tag} style={{
                  fontSize: 12, color: accentRgb, fontWeight: 600, whiteSpace: 'nowrap',
                  cursor: 'pointer', opacity: 0.9,
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Quick info strip */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', overflowX: 'auto', marginBottom: 14 }}>
              {[
                { icon: 'near_me', text: reel.distance },
                { icon: 'wb_sunny', text: reel.weather },
                { icon: 'groups', text: reel.crowd.charAt(0).toUpperCase() + reel.crowd.slice(1) + ' crowd' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20,
                  padding: '4px 10px', whiteSpace: 'nowrap',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12, color: accentRgb }}>{item.icon}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowInfo(true); }}
                style={{
                  flex: 1, padding: '12px', borderRadius: 14,
                  background: 'linear-gradient(135deg, #ff9933 0%, #e05500 100%)',
                  border: 'none', color: '#fff', fontWeight: 800, fontSize: 13,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  boxShadow: '0 6px 24px rgba(255,100,0,0.40)',
                  transition: 'all 0.3s ease',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>explore</span>
                Explore This Place
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); alert(`Opening map for ${reel.location} 🗺️`); }}
                style={{
                  padding: '12px 16px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 700,
                  transition: 'all 0.3s ease',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>map</span>
                Map
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showComment && <CommentModal reel={reel} onClose={() => setShowComment(false)} />}
      {showInfo && <InfoPanel reel={reel} onClose={() => setShowInfo(false)} />}
    </div>
  );
}

// ─── ACTION BUTTON ────────────────────────────────────────────────────────────
function ActionButton({ icon, label, color, glow, pulse, onClick }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={(e) => { setPressed(true); setTimeout(() => setPressed(false), 300); onClick(e); }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        transform: pressed ? 'scale(1.35)' : 'scale(1)',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: glow && glow !== 'none' ? `0 0 20px ${glow}` : 'none',
        animation: pulse ? 'reelHeartPulse 0.6s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 22, color, fontVariationSettings: "'FILL' 1", filter: glow && glow !== 'none' ? `drop-shadow(0 0 6px ${glow})` : 'none' }}>{icon}</span>
      </div>
      {label && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{label}</span>}
    </button>
  );
}

// ─── MAIN REELS PAGE ──────────────────────────────────────────────────────────
export default function ReelsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedReels, setLikedReels] = useState(new Set());
  const [savedReels, setSavedReels] = useState(new Set());
  const [followedCreators, setFollowedCreators] = useState(new Set());
  const [showCategories, setShowCategories] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const categoryScrollRef = useRef(null);

  const filteredReels = useMemo(() =>
    activeCategory === 'all' ? REELS_DATA : REELS_DATA.filter(r => r.category === activeCategory),
    [activeCategory]
  );

  // Ensure activeIndex is within range when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  const goToReel = useCallback((newIndex) => {
    if (isTransitioning) return;
    const clamped = Math.max(0, Math.min(newIndex, filteredReels.length - 1));
    if (clamped === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(clamped);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, activeIndex, filteredReels.length]);

  // Touch / pointer handlers for swipe
  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    setDragStartY(e.clientY || e.touches?.[0]?.clientY || 0);
    setTranslateY(0);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
    const delta = clientY - dragStartY;
    setTranslateY(Math.sign(delta) * Math.min(Math.abs(delta), 120) * 0.35);
  }, [isDragging, dragStartY]);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const clientY = e.clientY || e.changedTouches?.[0]?.clientY || 0;
    const delta = clientY - dragStartY;
    setTranslateY(0);
    if (delta < -60) goToReel(activeIndex + 1);
    else if (delta > 60) goToReel(activeIndex - 1);
  }, [isDragging, dragStartY, goToReel, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowDown') goToReel(activeIndex + 1);
      if (e.key === 'ArrowUp') goToReel(activeIndex - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToReel, activeIndex]);

  // Wheel scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let wheelTimer;
    const onWheel = (e) => {
      e.preventDefault();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        if (e.deltaY > 40) goToReel(activeIndex + 1);
        else if (e.deltaY < -40) goToReel(activeIndex - 1);
      }, 50);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [goToReel, activeIndex]);

  const handleLike = useCallback((id) => {
    setLikedReels(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleSave = useCallback((id) => {
    setSavedReels(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleFollow = useCallback((name) => {
    setFollowedCreators(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }, []);

  const handleShare = useCallback((id) => {
    navigator.clipboard?.writeText(`Check out this amazing travel reel on TourNet! 🌏 #TourNet`).catch(() => {});
    alert('Link copied to clipboard! 📋');
  }, []);

  const currentReel = filteredReels[activeIndex];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#000',
      overflow: 'hidden',
      userSelect: 'none',
    }}>
      {/* ── KEYFRAME INJECTION ── */}
      <style>{`
        @keyframes reelFlicker {
          0%,100% { opacity: 0.7; transform: scaleY(1) skewX(0deg); }
          30% { opacity: 0.9; transform: scaleY(1.12) skewX(-1deg); }
          60% { opacity: 0.55; transform: scaleY(0.9) skewX(1deg); }
        }
        @keyframes reelTwinkle {
          0%,100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes reelFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes reelGrass {
          0%,100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes reelHeartFloat {
          0% { opacity: 1; transform: translateY(0) scale(0.5); }
          30% { opacity: 1; transform: translateY(-40px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-120px) scale(0.8); }
        }
        @keyframes reelHeartPulse {
          0% { transform: scale(1); }
          40% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        @keyframes reelSkeleton {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes reelSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes reelFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes reelCatSlide {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes reelPip {
          0%,100% { transform: scaleX(1); }
          50% { transform: scaleX(1.1); }
        }
      `}</style>

      {/* ── CATEGORY BAR (top) ── */}
      {showCategories && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
          paddingTop: 'env(safe-area-inset-top, 44px)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
          animation: 'reelCatSlide 0.35s ease forwards',
        }}>
          <div
            ref={categoryScrollRef}
            style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 16px 16px', scrollbarWidth: 'none' }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={(e) => { e.stopPropagation(); setActiveCategory(cat.id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 20, border: 'none',
                  background: activeCategory === cat.id
                    ? 'linear-gradient(135deg, #ff9933, #e05500)'
                    : 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(16px)',
                  color: activeCategory === cat.id ? '#fff' : 'rgba(255,255,255,0.65)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  fontSize: 12, fontWeight: activeCategory === cat.id ? 700 : 500,
                  boxShadow: activeCategory === cat.id ? '0 4px 16px rgba(255,100,0,0.4)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: activeCategory === cat.id ? "'FILL' 1" : "'FILL' 0" }}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── REEL CONTAINER ── */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        {/* Current Reel */}
        {currentReel && (
          <div
            key={currentReel.id}
            style={{
              position: 'absolute', inset: 0,
              transform: `translateY(${translateY}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease',
              animation: 'reelFadeIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
            }}
          >
            <ReelCard
              reel={currentReel}
              isActive={true}
              onLike={handleLike}
              onComment={() => {}}
              onShare={handleShare}
              onSave={handleSave}
              onFollow={handleFollow}
              likedReels={likedReels}
              savedReels={savedReels}
              followedCreators={followedCreators}
            />
          </div>
        )}

        {/* Empty state */}
        {filteredReels.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'rgba(255,153,51,0.4)' }}>movie_filter</span>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: 600 }}>No reels in this category yet</p>
            <button onClick={() => setActiveCategory('all')} style={{ padding: '10px 24px', borderRadius: 20, background: 'linear-gradient(135deg, #ff9933, #e05500)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Explore All Reels
            </button>
          </div>
        )}
      </div>

      {/* ── SCROLL INDICATOR DOTS (right edge, vertical) ── */}
      {filteredReels.length > 1 && (
        <div style={{
          position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 4, zIndex: 15,
          maxHeight: '40vh', overflowY: 'hidden',
        }}>
          {filteredReels.slice(Math.max(0, activeIndex - 4), Math.min(filteredReels.length, activeIndex + 5)).map((r, i) => {
            const globalIdx = Math.max(0, activeIndex - 4) + i;
            const isCurrentDot = globalIdx === activeIndex;
            return (
              <div
                key={r.id}
                onClick={() => goToReel(globalIdx)}
                style={{
                  width: isCurrentDot ? 4 : 3,
                  height: isCurrentDot ? 20 : 6,
                  borderRadius: 2,
                  background: isCurrentDot ? '#ff9933' : 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: isCurrentDot ? '0 0 8px rgba(255,153,51,0.7)' : 'none',
                  animation: isCurrentDot ? 'reelPip 2s ease-in-out infinite' : 'none',
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── BOTTOM NAV SWIPE HINTS ── */}
      <div style={{
        position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
        zIndex: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        opacity: activeIndex === 0 ? 0.7 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', animation: 'reelFloat 1.5s ease-in-out infinite' }}>keyboard_arrow_up</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>SWIPE UP</span>
      </div>

      {/* ── REEL COUNTER ── */}
      <div style={{
        position: 'absolute', top: 96, right: 16, zIndex: 20,
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.10)', borderRadius: 20,
        padding: '4px 10px',
        fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
      }}>
        {activeIndex + 1} / {filteredReels.length}
      </div>

      {/* ── TOGGLE CATEGORY BAR ── */}
      <button
        onClick={(e) => { e.stopPropagation(); setShowCategories(v => !v); }}
        style={{
          position: 'absolute', top: 96, left: 16, zIndex: 20,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20,
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
        }}
        title={showCategories ? 'Hide categories' : 'Show categories'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showCategories ? 'filter_list_off' : 'filter_list'}</span>
      </button>
    </div>
  );
}
