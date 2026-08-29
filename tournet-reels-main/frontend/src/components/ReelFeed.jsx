import { useCallback, useEffect, useRef, useState } from 'react';
import ReelCard from './ReelCard.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function ReelFeed({ reels, loading, error, hasMore, loadMore, updateReel, removeReel }) {
  const feedRef = useRef(null);
  const [activeId, setActiveId] = useState(reels[0]?.id ?? null);

  // Reels load asynchronously after the initial render, so seed activeId
  // once the first batch arrives (keeps the first video autoplaying).
  useEffect(() => {
    if (activeId === null && reels.length > 0) setActiveId(reels[0].id);
  }, [reels, activeId]);

  const handleActivate = useCallback((id) => setActiveId(id), []);
  const handleDeactivate = useCallback((id) => {
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const handleScroll = useCallback(() => {
    const el = feedRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - el.clientHeight * 1.5;
    if (nearBottom) loadMore();
  }, [loadMore]);

  if (loading && reels.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoadingSpinner size={36} />
      </div>
    );
  }

  if (error && reels.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-sand-muted gap-2 px-6 text-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!loading && reels.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-sand-muted gap-2 px-6 text-center">
        <p className="font-display text-lg text-sand">No reels yet</p>
        <p className="text-sm">Be the first to share a journey.</p>
      </div>
    );
  }

  const activeIndex = Math.max(reels.findIndex((r) => r.id === activeId), 0);

  return (
    <div className="relative h-full w-full">
      <div ref={feedRef} onScroll={handleScroll} className="reel-feed h-full w-full">
        {reels.map((reel) => (
          <div key={reel.id} className="h-full w-full">
            <ReelCard
              reel={reel}
              isActive={reel.id === activeId}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              onChange={(patch) => updateReel(reel.id, patch)}
              onDelete={removeReel}
            />
          </div>
        ))}
        {loading && reels.length > 0 && (
          <div className="h-24 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>

      {/* Signature trail-rail: itinerary-style waypoint markers for the visible window of reels */}
      <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 trail-rail z-10">
        {reels.slice(Math.max(0, activeIndex - 3), activeIndex + 4).map((r) => (
          <div key={r.id} className={`trail-dash ${r.id === activeId ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
