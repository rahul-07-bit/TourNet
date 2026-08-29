import { useNavigate } from 'react-router-dom';
import { Heart, Play } from 'lucide-react';

export default function ReelGrid({ reels, emptyLabel = 'No reels yet.' }) {
  const navigate = useNavigate();

  if (reels.length === 0) {
    return <p className="text-sand-muted text-sm text-center py-12">{emptyLabel}</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
      {reels.map((reel) => (
        <button
          key={reel.id}
          onClick={() => navigate(`/reels/${reel.id}`)}
          className="relative aspect-[9/16] bg-dusk-800 rounded-lg overflow-hidden group"
        >
          {reel.thumbnailUrl ? (
            <img src={reel.thumbnailUrl} alt={reel.caption} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sand-muted">
              <Play size={24} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-xs text-sand font-medium drop-shadow">
            <Heart size={12} className="fill-sand" />
            {reel.likesCount}
          </div>
        </button>
      ))}
    </div>
  );
}
