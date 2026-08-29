import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { reelService } from '../services/reelService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function ReelInfo({ reel }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [following, setFollowing] = useState(false);
  const [pending, setPending] = useState(false);
  const isOwnReel = user && user.id === reel.creator.id;

  const toggleFollow = async (e) => {
    e.stopPropagation();
    if (!user) return showToast('Log in to follow creators.', 'error');
    setPending(true);
    try {
      if (following) {
        await reelService.unfollow(reel.creator.id);
        setFollowing(false);
      } else {
        await reelService.follow(reel.creator.id);
        setFollowing(true);
      }
    } catch (err) {
      showToast(err?.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-[calc(100%-64px)] text-sand drop-shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Link to={`/profile/${reel.creator.username}`} className="flex items-center gap-2 min-w-0">
          <img
            src={reel.creator.profileImage || `https://i.pravatar.cc/80?u=${reel.creator.username}`}
            alt={reel.creator.username}
            className="w-9 h-9 rounded-full object-cover border border-sand/30 shrink-0"
          />
          <span className="font-display font-semibold text-sm truncate">@{reel.creator.username}</span>
        </Link>
        {!isOwnReel && (
          <button
            onClick={toggleFollow}
            disabled={pending}
            className={`text-xs font-semibold px-3 py-1 rounded-full border transition-colors shrink-0 ${
              following
                ? 'border-sand/30 text-sand/80'
                : 'border-trail bg-trail/90 text-dusk-950 hover:bg-trail'
            }`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {reel.caption && <p className="text-sm leading-snug mb-1.5">{reel.caption}</p>}

      {reel.hashtags?.length > 0 && (
        <p className="text-sm text-horizon font-medium mb-1.5">
          {reel.hashtags.map((tag) => `#${tag}`).join(' ')}
        </p>
      )}

      {reel.location && (
        <div className="flex items-center gap-1 text-xs text-sand-muted">
          <MapPin size={13} />
          <span>{reel.location}</span>
        </div>
      )}
    </div>
  );
}
