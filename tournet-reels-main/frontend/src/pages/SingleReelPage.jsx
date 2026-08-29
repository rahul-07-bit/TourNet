import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReelFeed from '../components/ReelFeed.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { reelService } from '../services/reelService.js';

export default function SingleReelPage() {
  const { id } = useParams();
  const [reel, setReel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    reelService
      .getReel(id)
      .then((res) => setReel(res.data.reel))
      .catch((err) => setError(err?.response?.data?.message || 'Reel not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen md:h-[calc(100vh-64px)] flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (error || !reel) {
    return (
      <div className="h-screen md:h-[calc(100vh-64px)] flex items-center justify-center text-sand-muted">
        {error || 'Reel not found.'}
      </div>
    );
  }

  return (
    <div className="h-screen md:h-[calc(100vh-64px)]">
      <ReelFeed
        reels={[reel]}
        loading={false}
        error={null}
        hasMore={false}
        loadMore={() => {}}
        updateReel={(_, patch) => setReel((r) => ({ ...r, ...patch }))}
        removeReel={() => {}}
      />
    </div>
  );
}
