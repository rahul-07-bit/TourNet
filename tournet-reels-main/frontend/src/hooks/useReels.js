import { useCallback, useEffect, useRef, useState } from 'react';
import { reelService } from '../services/reelService';

// Fetches the reel feed with pagination and exposes a loadMore() for
// infinite scroll. Guards against duplicate concurrent requests.
export function useReels() {
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchingRef = useRef(false);

  const loadPage = useCallback(async (targetPage) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const res = await reelService.getFeed(targetPage, 10);
      const newReels = res.data.reels;
      setReels((prev) => (targetPage === 1 ? newReels : [...prev, ...newReels]));
      setHasMore(newReels.length === 10);
      setPage(targetPage);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load reels.');
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || fetchingRef.current) return;
    loadPage(page + 1);
  }, [hasMore, page, loadPage]);

  const updateReel = useCallback((id, patch) => {
    setReels((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const removeReel = useCallback((id) => {
    setReels((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { reels, loading, error, hasMore, loadMore, updateReel, removeReel, refresh: () => loadPage(1) };
}
