import ReelFeed from '../components/ReelFeed.jsx';
import { useReels } from '../hooks/useReels.js';

export default function ReelsPage() {
  const { reels, loading, error, hasMore, loadMore, updateReel, removeReel } = useReels();

  return (
    <div className="h-screen md:h-[calc(100vh-64px)]">
      <ReelFeed
        reels={reels}
        loading={loading}
        error={error}
        hasMore={hasMore}
        loadMore={loadMore}
        updateReel={updateReel}
        removeReel={removeReel}
      />
    </div>
  );
}
