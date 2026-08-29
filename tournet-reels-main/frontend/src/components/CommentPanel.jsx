import { useEffect, useState } from 'react';
import { X, Send, Trash2 } from 'lucide-react';
import { useComments } from '../hooks/useComments.js';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function CommentPanel({ reel, onClose, onCountChange }) {
  const { comments, loading, posting, loadComments, postComment, removeComment } = useComments(reel.id);
  const { user } = useAuth();
  const { showToast } = useToast();
  const [text, setText] = useState('');

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reel.id]);

  useEffect(() => {
    onCountChange(comments.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comments.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return showToast('Log in to comment.', 'error');
    const trimmed = text.trim();
    if (!trimmed) return;
    const ok = await postComment(trimmed);
    if (ok) setText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full md:w-[420px] md:max-h-[80vh] bg-dusk-900 border-t md:border border-dusk-700 rounded-t-2xl md:rounded-2xl flex flex-col max-h-[75vh] animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dusk-700">
          <h3 className="font-display font-semibold text-sand">Comments</h3>
          <button onClick={onClose} className="text-sand-muted hover:text-sand" aria-label="Close comments">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          {loading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {!loading && comments.length === 0 && (
            <p className="text-sand-muted text-sm text-center py-8">
              No comments yet. Be the first to share your thoughts.
            </p>
          )}

          {!loading &&
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <img
                  src={c.profileImage || `https://i.pravatar.cc/60?u=${c.username}`}
                  alt={c.username}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-sand">
                    <span className="font-semibold">@{c.username}</span>{' '}
                    <span className="text-sand/90">{c.text}</span>
                  </p>
                  <p className="text-xs text-sand-muted mt-0.5">{timeAgo(c.createdAt)}</p>
                </div>
                {user && user.id === c.userId && (
                  <button
                    onClick={() => removeComment(c.id)}
                    className="text-sand-muted hover:text-red-400 shrink-0"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-dusk-700">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={user ? 'Add a comment...' : 'Log in to comment'}
            disabled={!user}
            className="flex-1 bg-dusk-800 border border-dusk-600 rounded-full px-4 py-2 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail disabled:opacity-50"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!user || posting || !text.trim()}
            className="bg-trail text-dusk-950 p-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-trail-light transition-colors"
            aria-label="Post comment"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const intervals = [
    ['y', 31536000], ['mo', 2592000], ['d', 86400], ['h', 3600], ['m', 60]
  ];
  for (const [label, secs] of intervals) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return 'just now';
}
