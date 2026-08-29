import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import { reelService } from '../services/reelService.js';

export default function ProfileHeader({ profile, onFollowChange }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);
  const isOwnProfile = user && user.username === profile.username;

  const toggleFollow = async () => {
    if (!user) return showToast('Log in to follow creators.', 'error');
    setPending(true);
    try {
      if (profile.isFollowedByMe) {
        await reelService.unfollow(profile.id);
        onFollowChange({ isFollowedByMe: false, followers: profile.followers - 1 });
      } else {
        await reelService.follow(profile.id);
        onFollowChange({ isFollowedByMe: true, followers: profile.followers + 1 });
      }
    } catch (err) {
      showToast(err?.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-6 pt-8 pb-6 border-b border-dusk-700">
      <img
        src={profile.profileImage || `https://i.pravatar.cc/150?u=${profile.username}`}
        alt={profile.username}
        className="w-24 h-24 rounded-full object-cover border-2 border-dusk-600"
      />
      <h2 className="font-display font-semibold text-xl text-sand mt-3">{profile.name}</h2>
      <p className="text-sand-muted text-sm">@{profile.username}</p>
      {profile.bio && <p className="text-sand/90 text-sm mt-2 max-w-sm">{profile.bio}</p>}

      <div className="flex items-center gap-6 mt-4">
        <Stat label="Reels" value={profile.reelCount} />
        <Stat label="Followers" value={profile.followers} />
        <Stat label="Following" value={profile.following} />
      </div>

      {!isOwnProfile && (
        <button
          onClick={toggleFollow}
          disabled={pending}
          className={`mt-4 text-sm font-semibold px-6 py-2 rounded-full transition-colors ${
            profile.isFollowedByMe
              ? 'border border-dusk-600 text-sand'
              : 'bg-trail text-dusk-950 hover:bg-trail-light'
          }`}
        >
          {profile.isFollowedByMe ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="font-display font-semibold text-sand">{value}</div>
      <div className="text-xs text-sand-muted">{label}</div>
    </div>
  );
}
