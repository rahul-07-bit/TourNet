import { useRef, useState, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import VideoPlayer from './VideoPlayer.jsx';
import ReelActions from './ReelActions.jsx';
import ReelInfo from './ReelInfo.jsx';
import CommentPanel from './CommentPanel.jsx';
import ShareModal from './ShareModal.jsx';
import { useVideoAutoplay } from '../hooks/useVideoAutoplay.js';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { reelService } from '../services/reelService.js';

export default function ReelCard({ reel, onActivate, onDeactivate, isActive, onChange, onDelete }) {
  const containerRef = useRef(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [savePending, setSavePending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useVideoAutoplay(containerRef, {
    onActive: () => onActivate(reel.id),
    onInactive: () => onDeactivate(reel.id),
    threshold: 0.6
  });

  const handleSaveToggle = useCallback(async () => {
    if (!user) return showToast('Log in to save reels.', 'error');
    setSavePending(true);
    const wasSaved = reel.savedByMe;
    onChange({ savedByMe: !wasSaved });
    try {
      if (wasSaved) await reelService.unsave(reel.id);
      else await reelService.save(reel.id);
    } catch (err) {
      onChange({ savedByMe: wasSaved });
      showToast(err?.response?.data?.message || 'Could not update saved reels.', 'error');
    } finally {
      setSavePending(false);
    }
  }, [reel, user, onChange, showToast]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this reel? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await reelService.deleteReel(reel.id);
      showToast('Reel deleted.', 'success');
      onDelete(reel.id);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Could not delete reel.', 'error');
      setDeleting(false);
    }
  };

  const isOwnReel = user && user.id === reel.creator.id;

  return (
    <div ref={containerRef} className="reel-slide relative w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full md:w-[420px] md:h-[92vh] md:rounded-2xl overflow-hidden md:shadow-glow">
        <VideoPlayer src={reel.videoUrl} thumbnail={reel.thumbnailUrl} isActive={isActive} className="w-full h-full" />

        {isOwnReel && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-sm p-2 rounded-full text-sand hover:bg-red-500/60 transition-colors"
            aria-label="Delete reel"
          >
            <Trash2 size={16} />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 md:p-5 z-10">
          <ReelInfo reel={reel} />
          <ReelActions
            reel={reel}
            onChange={onChange}
            onCommentClick={() => setShowComments(true)}
            onShareClick={() => setShowShare(true)}
            onSaveToggle={handleSaveToggle}
            savePending={savePending}
          />
        </div>
      </div>

      {showComments && (
        <CommentPanel reel={reel} onClose={() => setShowComments(false)} onCountChange={(n) => onChange({ commentsCount: n })} />
      )}
      {showShare && <ShareModal reel={reel} onClose={() => setShowShare(false)} />}
    </div>
  );
}
