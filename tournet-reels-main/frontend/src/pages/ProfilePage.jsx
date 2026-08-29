import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader.jsx';
import ReelGrid from '../components/ReelGrid.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { reelService } from '../services/reelService.js';

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([reelService.getProfile(username), reelService.getProfileReels(username)])
      .then(([profileRes, reelsRes]) => {
        setProfile(profileRes.data.user);
        setReels(reelsRes.data.reels);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Profile not found.'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (error || !profile) {
    return <p className="text-center text-sand-muted py-16">{error || 'Profile not found.'}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-8">
      <ProfileHeader profile={profile} onFollowChange={(patch) => setProfile((p) => ({ ...p, ...patch }))} />
      <div className="px-4 pt-5">
        <ReelGrid reels={reels} emptyLabel="No reels shared yet." />
      </div>
    </div>
  );
}
