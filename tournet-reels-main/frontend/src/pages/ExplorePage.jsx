import { useState } from 'react';
import { Search } from 'lucide-react';
import ReelGrid from '../components/ReelGrid.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { reelService } from '../services/reelService.js';

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await reelService.search(query.trim());
      setReels(res.data.reels);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <h1 className="font-display font-semibold text-xl text-sand mb-4">Explore</h1>

      <form onSubmit={handleSearch} className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sand-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search captions, hashtags, locations, creators..."
          className="w-full bg-dusk-800 border border-dusk-600 rounded-full pl-11 pr-4 py-3 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail"
        />
      </form>

      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size={32} />
        </div>
      )}

      {!loading && searched && <ReelGrid reels={reels} emptyLabel="No reels match your search." />}

      {!searched && !loading && (
        <p className="text-sand-muted text-sm text-center py-16">
          Search for a destination, hashtag, or creator to get started.
        </p>
      )}
    </div>
  );
}
