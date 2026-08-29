import { useCallback, useState } from 'react';
import { reelService } from '../services/reelService';
import { useToast } from './useToast';

export function useComments(reelId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const { showToast } = useToast();

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reelService.getComments(reelId);
      setComments(res.data.comments);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not load comments.', 'error');
    } finally {
      setLoading(false);
    }
  }, [reelId, showToast]);

  const postComment = useCallback(
    async (text) => {
      setPosting(true);
      try {
        const res = await reelService.addComment(reelId, text);
        setComments((prev) => [...prev, res.data.comment]);
        return true;
      } catch (err) {
        showToast(err?.response?.data?.message || 'Could not post comment.', 'error');
        return false;
      } finally {
        setPosting(false);
      }
    },
    [reelId, showToast]
  );

  const removeComment = useCallback(
    async (commentId) => {
      const prev = comments;
      setComments((c) => c.filter((x) => x.id !== commentId));
      try {
        await reelService.deleteComment(commentId);
      } catch (err) {
        setComments(prev);
        showToast(err?.response?.data?.message || 'Could not delete comment.', 'error');
      }
    },
    [comments, showToast]
  );

  return { comments, loading, posting, loadComments, postComment, removeComment };
}
