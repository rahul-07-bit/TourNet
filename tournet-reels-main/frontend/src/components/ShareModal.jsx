import { X, Link2, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareModal({ reel, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/reels/${reel.id}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'TourNet', text: reel.caption, url: shareUrl });
        onClose();
      } catch (err) {
        // user cancelled — no-op
      }
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this reel on TourNet: ${shareUrl}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full md:w-[380px] bg-dusk-900 border-t md:border border-dusk-700 rounded-t-2xl md:rounded-2xl p-5 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-sand">Share reel</h3>
          <button onClick={onClose} className="text-sand-muted hover:text-sand" aria-label="Close share menu">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full text-left px-4 py-3 rounded-xl bg-dusk-800 hover:bg-dusk-700 text-sand text-sm font-medium transition-colors"
            >
              Share via...
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 rounded-xl bg-dusk-800 hover:bg-dusk-700 text-sand text-sm font-medium transition-colors"
          >
            Share to WhatsApp
          </a>

          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-dusk-800 hover:bg-dusk-700 text-sand text-sm font-medium transition-colors"
          >
            {copied ? <Check size={16} className="text-horizon" /> : <Link2 size={16} />}
            {copied ? 'Link copied' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  );
}
