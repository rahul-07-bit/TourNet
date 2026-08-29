import { useState, useCallback } from 'react';
import { reelService } from '../services/reelService';
import { useToast } from './useToast';

export function useLike(reel, onChange) {
  const [pending, setPending] = useState(false);
  const { showToast } = useToast();

  const toggleLike = useCallback(async () => {
    if (pending) return;
    const wasLiked = reel.likedByMe;
    const prevCount = reel.likesCount;

    // Optimistic update
    onChange({ likedByMe: !wasLiked, likesCount: prevCount + (wasLiked ? -1 : 1) });
    setPending(true);

    try {
      const res = wasLiked ? await reelService.unlike(reel.id) : await reelService.like(reel.id);
      onChange({ likedByMe: res.data.likedByMe, likesCount: res.data.likesCount });
    } catch (err) {
      // Roll back on failure
      onChange({ likedByMe: wasLiked, likesCount: prevCount });
      showToast(err?.response?.data?.message || 'Could not update like.', 'error');
    } finally {
      setPending(false);
    }
  }, [reel, pending, onChange, showToast]);

  return { toggleLike, pending };
}
