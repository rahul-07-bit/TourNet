import { useEffect, useRef } from 'react';

/**
 * Observes `elementRef` and calls `onActive()` once the element crosses
 * the visibility threshold (i.e. it's the reel centered in the viewport),
 * and `onInactive()` when it leaves. Each ReelCard uses one of these —
 * the parent feed only ever has a single "active" id at a time because
 * scroll-snap guarantees one slide dominates the viewport.
 */
export function useVideoAutoplay(elementRef, { onActive, onInactive, threshold = 0.6 } = {}) {
  const wasActive = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isActive = entry.isIntersecting && entry.intersectionRatio >= threshold;
          if (isActive && !wasActive.current) {
            wasActive.current = true;
            onActive && onActive();
          } else if (!isActive && wasActive.current) {
            wasActive.current = false;
            onInactive && onInactive();
          }
        });
      },
      { threshold: [0, threshold, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef]);
}
