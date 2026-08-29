import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X } from 'lucide-react';
import { reelService } from '../services/reelService.js';
import { useToast } from '../hooks/useToast.js';

const MAX_SIZE_MB = 100;

export default function UploadReel() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith('video/')) {
      return showToast('Please select a video file.', 'error');
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      return showToast(`Video must be under ${MAX_SIZE_MB}MB.`, 'error');
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return showToast('Please select a video to upload.', 'error');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('caption', caption);
    formData.append('hashtags', hashtags);
    formData.append('location', location);

    setUploading(true);
    setProgress(0);
    try {
      const res = await reelService.upload(formData, setProgress);
      showToast('Reel uploaded successfully!', 'success');
      navigate(`/reels/${res.data.reel.id}`);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="font-display font-semibold text-2xl text-sand mb-1">Upload reel</h1>
      <p className="text-sand-muted text-sm mb-6">Share a moment from your journey.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!file ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[9/12] border-2 border-dashed border-dusk-600 rounded-2xl flex flex-col items-center justify-center gap-3 text-sand-muted hover:border-trail hover:text-trail transition-colors"
          >
            <UploadCloud size={36} />
            <span className="font-medium">Select video</span>
            <span className="text-xs">MP4, MOV, WEBM · up to {MAX_SIZE_MB}MB</span>
          </button>
        ) : (
          <div className="relative w-full max-w-[240px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-black">
            <video src={previewUrl} className="w-full h-full object-cover" controls muted loop playsInline />
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-sand"
              aria-label="Remove video"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />

        <div>
          <label className="block text-sm font-medium text-sand mb-1.5">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Tell the story behind this reel..."
            rows={3}
            maxLength={300}
            className="w-full bg-dusk-800 border border-dusk-600 rounded-xl px-4 py-2.5 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sand mb-1.5">Hashtags</label>
          <input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            placeholder="#travel #india #mountains"
            className="w-full bg-dusk-800 border border-dusk-600 rounded-xl px-4 py-2.5 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sand mb-1.5">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Manali, India"
            className="w-full bg-dusk-800 border border-dusk-600 rounded-xl px-4 py-2.5 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail"
          />
        </div>

        {uploading && (
          <div className="w-full h-2 bg-dusk-800 rounded-full overflow-hidden">
            <div className="h-full bg-trail transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full bg-trail text-dusk-950 font-semibold py-3 rounded-full hover:bg-trail-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload reel'}
        </button>
      </form>
    </div>
  );
}
