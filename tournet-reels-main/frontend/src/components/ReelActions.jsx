import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useLike } from '../hooks/useLike.js';

export default function ReelActions({ reel, onChange, onCommentClick, onShareClick, onSaveToggle, savePending }) {
  const { toggleLike, pending } = useLike(reel, onChange);

  return (
    <div className="flex flex-col items-center gap-5">
      <button onClick={toggleLike} disabled={pending} className="flex flex-col items-center gap-1 group">
        <span
          className={`p-3 rounded-full backdrop-blur-sm transition-all ${
            reel.likedByMe ? 'bg-trail/20' : 'bg-black/30 group-hover:bg-black/50'
          }`}
        >
          <Heart
            size={24}
            className={reel.likedByMe ? 'fill-trail text-trail' : 'text-sand'}
          />
        </span>
        <span className="text-xs font-medium text-sand drop-shadow">{formatCount(reel.likesCount)}</span>
      </button>

      <button onClick={onCommentClick} className="flex flex-col items-center gap-1 group">
        <span className="p-3 rounded-full bg-black/30 group-hover:bg-black/50 backdrop-blur-sm transition-colors">
          <MessageCircle size={24} className="text-sand" />
        </span>
        <span className="text-xs font-medium text-sand drop-shadow">{formatCount(reel.commentsCount)}</span>
      </button>

      <button onClick={onShareClick} className="flex flex-col items-center gap-1 group">
        <span className="p-3 rounded-full bg-black/30 group-hover:bg-black/50 backdrop-blur-sm transition-colors">
          <Share2 size={24} className="text-sand" />
        </span>
        <span className="text-xs font-medium text-sand drop-shadow">Share</span>
      </button>

      <button onClick={onSaveToggle} disabled={savePending} className="flex flex-col items-center gap-1 group">
        <span
          className={`p-3 rounded-full backdrop-blur-sm transition-all ${
            reel.savedByMe ? 'bg-horizon/20' : 'bg-black/30 group-hover:bg-black/50'
          }`}
        >
          <Bookmark size={22} className={reel.savedByMe ? 'fill-horizon text-horizon' : 'text-sand'} />
        </span>
      </button>
    </div>
  );
}

function formatCount(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}
