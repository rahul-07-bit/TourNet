import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import ReelGrid from '../components/ReelGrid.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { reelService } from '../services/reelService.js';

export default function SavedPage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reelService
      .getMySaved()
      .then((res) => setReels(res.data.reels))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <div className="flex items-center gap-2 mb-5">
        <Bookmark size={20} className="text-trail" />
        <h1 className="font-display font-semibold text-xl text-sand">Saved reels</h1>
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size={32} />
        </div>
      ) : (
        <ReelGrid reels={reels} emptyLabel="You haven't saved any reels yet." />
      )}
    </div>
  );
}
