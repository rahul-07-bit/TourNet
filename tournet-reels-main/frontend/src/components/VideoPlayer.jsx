import { useEffect, useRef, useState } from 'react';
import { Play, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function VideoPlayer({ src, thumbnail, isActive, className = '' }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);

  // Drive play/pause purely from the `isActive` flag handed down by the feed
  // (which is itself driven by IntersectionObserver in ReelCard).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || hasError) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setShowPauseIcon(false);
    } else {
      video.pause();
      setIsPlaying(false);
      setShowPauseIcon(true);
      setTimeout(() => setShowPauseIcon(false), 600);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className={`relative bg-black overflow-hidden ${className}`} onClick={togglePlay}>
      {thumbnail && isLoading && !hasError && (
        <img src={thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
      )}

      {!hasError && (
        <video
          ref={videoRef}
          src={src}
          poster={thumbnail}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sand-muted bg-dusk-900">
          <AlertCircle size={28} />
          <p className="text-sm">This video couldn't load.</p>
        </div>
      )}

      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <LoadingSpinner size={36} />
        </div>
      )}

      {!isPlaying && !isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-4 backdrop-blur-sm">
            <Play size={28} className="text-sand fill-sand" />
          </div>
        </div>
      )}

      {showPauseIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in-up">
          <div className="bg-black/40 rounded-full p-4 backdrop-blur-sm">
            <Play size={28} className="text-sand fill-sand" style={{ display: isPlaying ? 'none' : 'block' }} />
          </div>
        </div>
      )}

      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm p-2 rounded-full text-sand hover:bg-black/60 transition-colors z-10"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}
