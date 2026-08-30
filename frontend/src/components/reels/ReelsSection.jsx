import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  addComment,
  createReel,
  deleteComment,
  deleteReel,
  getComments,
  getInteractions,
  getProfiles,
  getReels,
  recordView,
  reportReel,
  publicStorageUrl,
  toggleRelation,
} from '../../services/reelService';

const PAGE_SIZE = 10;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

function formatCount(value) {
  return Number(value || 0).toLocaleString();
}

function profileName(profile) {
  return profile?.name || profile?.full_name || profile?.email?.split('@')[0] || 'TourNet traveler';
}

function username(profile, userId) {
  const base = profile?.email?.split('@')[0] || profileName(profile).replace(/\s+/g, '').toLowerCase() || userId?.slice(0, 8);
  return `@${base}`;
}

function ReelVideo({ reel, isActive }) {
  const videoRef = useRef(null);
  const [url, setUrl] = useState('');
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [fast, setFast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setUrl('');
    setError(false);
    setLoading(true);
    try {
      const value = publicStorageUrl(reel.video_path);
      if (import.meta.env.DEV) {
        console.info('[TourNet Reels] video_path', reel.video_path);
        console.info('[TourNet Reels] public video URL', value);
      }
      if (mounted) setUrl(value);
    } catch (err) {
      if (mounted) setError(true);
      if (import.meta.env.DEV) console.error('[TourNet Reels] could not build video URL', err);
    } finally {
      if (mounted) setLoading(false);
    }
    return () => { mounted = false; };
  }, [reel.video_path]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
    videoRef.current.playbackRate = fast ? 2 : 1;
    if (isActive && url && !paused) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [fast, isActive, muted, paused, url]);

  useEffect(() => {
    setFast(false);
    setPaused(false);
    if (videoRef.current) videoRef.current.playbackRate = 1;
  }, [reel.id]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPaused(false)).catch(() => {});
    } else {
      video.pause();
      setPaused(true);
    }
  };

  const toggleSpeed = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextFast = !fast;
    video.playbackRate = nextFast ? 2 : 1;
    setFast(nextFast);
  };

  if (error) return <div className="reel-fallback">Video unavailable</div>;

  return (
    <>
      {loading && <div className="reel-video-loading">Loading video...</div>}
      <video
        ref={videoRef}
        className="reel-video"
        src={url || undefined}
        muted={muted}
        loop
        playsInline
        preload={isActive ? 'metadata' : 'none'}
        onCanPlay={() => setLoading(false)}
        onClick={togglePlayback}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onError={(event) => {
          setError(true);
          if (import.meta.env.DEV) console.error('[TourNet Reels] video element error', event.currentTarget.error);
        }}
      />
      <div className="reel-video-controls">
        <button type="button" onClick={togglePlayback} aria-label={paused ? 'Play Reel' : 'Pause Reel'} title={paused ? 'Play' : 'Pause'}>
          <span className="material-symbols-outlined">{paused ? 'play_arrow' : 'pause'}</span>
        </button>
        <button type="button" className={fast ? 'is-active' : ''} onClick={toggleSpeed} aria-label={fast ? 'Return Reel to normal speed' : 'Play Reel at 2x speed'} title={fast ? '1x speed' : '2x speed'}>
          {fast ? '2x' : '1x'}
        </button>
      </div>
      <button className="reel-mute" type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? 'Unmute Reel' : 'Mute Reel'} title={muted ? 'Unmute' : 'Mute'}>
        <span className="material-symbols-outlined">{muted ? 'volume_off' : 'volume_up'}</span>
      </button>
    </>
  );
}

function CreateReelModal({ onClose, onCreated, user }) {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [preview, setPreview] = useState('');
  const [duration, setDuration] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!video) return undefined;
    const url = URL.createObjectURL(video);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  const selectVideo = (file) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file.');
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setError('Video must be 100MB or smaller.');
      return;
    }
    setVideo(file);
  };

  const publish = async (event) => {
    event.preventDefault();
    if (!user) {
      setError('Please sign in to publish a Reel.');
      return;
    }
    if (!video) {
      setError('Select a video before publishing.');
      return;
    }

    setPublishing(true);
    setError('');
    try {
      setStatus('Uploading video...');
      const tags = hashtags
        .split(/[\s,]+/)
        .map((tag) => tag.replace(/^#/, '').trim())
        .filter(Boolean);

      setStatus('Creating Reel...');
      const reel = await createReel({
        file: video,
        thumbnail,
        caption,
        location,
        hashtags: tags,
        duration,
        userId: user.id,
      });

      setStatus('Published.');
      onCreated(reel);
      onClose();
    } catch (err) {
      setError(err.message || 'Could not publish Reel.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="reel-modal" role="dialog" aria-modal="true">
      <form className="reel-dialog" onSubmit={publish}>
        <button type="button" onClick={onClose} aria-label="Close">×</button>
        <h3>Create a Reel</h3>
        <label className="reel-file">
          <span className="material-symbols-outlined">video_library</span>
          <b>{video ? video.name : 'Select Video'}</b>
          <input type="file" accept="video/*" onChange={(event) => selectVideo(event.target.files?.[0])} />
        </label>
        {preview && (
          <video
            className="reel-preview"
            src={preview}
            controls
            playsInline
            onLoadedMetadata={(event) => setDuration(Math.round(event.currentTarget.duration))}
          />
        )}
        <label>Caption<textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Write something about your journey..." /></label>
        <label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Enter location" /></label>
        <label>Hashtags<input value={hashtags} onChange={(event) => setHashtags(event.target.value)} placeholder="#travel #tournet" /></label>
        <label>Optional thumbnail<input type="file" accept="image/*" onChange={(event) => setThumbnail(event.target.files?.[0] || null)} /></label>
        {status && <p className="reel-status">{status}</p>}
        {error && <p className="reel-form-error">{error}</p>}
        <div className="reel-dialog-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={publishing}>{publishing ? 'Publishing...' : 'Publish Reel'}</button>
        </div>
      </form>
    </div>
  );
}

function CommentsModal({ reel, user, onClose, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [profiles, setProfiles] = useState(new Map());
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await getComments(reel.id);
      setComments(rows);
      setProfiles(await getProfiles(rows.map((comment) => comment.user_id)));
    } catch (err) {
      setError(err.message || 'Could not load comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [reel.id]);

  const submit = async (event) => {
    event.preventDefault();
    if (!user) return setError('Sign in to comment.');
    if (!content.trim()) return;
    try {
      const row = await addComment(reel.id, user.id, content.trim());
      setComments((previous) => [...previous, row]);
      setContent('');
      onCountChange(1);
    } catch (err) {
      setError(err.message || 'Could not add comment.');
    }
  };

  const remove = async (comment) => {
    if (!user || comment.user_id !== user.id) return;
    await deleteComment(comment.id, user.id);
    setComments((previous) => previous.filter((item) => item.id !== comment.id));
    onCountChange(-1);
  };

  return (
    <div className="reel-modal" role="dialog" aria-modal="true">
      <div className="reel-dialog">
        <button type="button" onClick={onClose} aria-label="Close">×</button>
        <h3>Comments</h3>
        {loading && <p className="reel-status">Loading comments...</p>}
        {error && <p className="reel-form-error">{error}</p>}
        <div className="reel-comments">
          {comments.map((comment) => {
            const profile = profiles.get(comment.user_id);
            return (
              <div className="reel-comment" key={comment.id}>
                <div><b>{profileName(profile)}</b><p>{comment.content}</p></div>
                {user?.id === comment.user_id && <button type="button" onClick={() => remove(comment)}>Delete</button>}
              </div>
            );
          })}
          {!loading && !comments.length && <p className="reel-status">No comments yet.</p>}
        </div>
        <form className="comment-form" onSubmit={submit}>
          <input value={content} onChange={(event) => setContent(event.target.value)} placeholder="Add a comment..." />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export default function ReelsSection() {
  const { user } = useAuth();
  const [reels, setReels] = useState([]);
  const [profiles, setProfiles] = useState(new Map());
  const [liked, setLiked] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [commentsReel, setCommentsReel] = useState(null);
  const viewedRef = useRef(new Set());

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const rows = await getReels({ from: 0, to: PAGE_SIZE - 1 });
      setReels(rows);
      setActive((value) => Math.min(value, Math.max(rows.length - 1, 0)));
      setProfiles(await getProfiles(rows.map((row) => row.user_id)));
      const interactions = await getInteractions(rows.map((row) => row.id), user?.id);
      setLiked(interactions.liked);
      setSaved(interactions.saved);
    } catch (err) {
      setReels([]);
      setLoadError(err.message || "Couldn't load Reels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user?.id]);

  const patchReel = (reelId, changes) => {
    setReels((previous) => previous.map((item) => item.id === reelId ? { ...item, ...changes } : item));
  };

  useEffect(() => {
    const reel = reels[active];
    if (!reel || !user?.id || viewedRef.current.has(reel.id)) return;

    viewedRef.current.add(reel.id);
    patchReel(reel.id, { views_count: Number(reel.views_count || 0) + 1 });
    recordView(reel.id, user.id).catch((err) => {
      viewedRef.current.delete(reel.id);
      patchReel(reel.id, { views_count: reel.views_count || 0 });
      setMessage(err.message || 'Could not record Reel view.');
    });
  }, [active, reels, user?.id]);

  const toggle = async (table, reelId, state, setState, countField) => {
    if (!user) return setMessage('Sign in to interact with Reels.');
    const reel = reels.find((item) => item.id === reelId);
    const wasActive = state.has(reelId);
    const delta = wasActive ? -1 : 1;
    setState((previous) => {
      const next = new Set(previous);
      if (wasActive) next.delete(reelId); else next.add(reelId);
      return next;
    });
    patchReel(reelId, { [countField]: Math.max(0, Number(reel?.[countField] || 0) + delta) });

    const { error } = await toggleRelation(table, reelId, user.id, wasActive);
    if (error) {
      setState((previous) => {
        const next = new Set(previous);
        if (wasActive) next.add(reelId); else next.delete(reelId);
        return next;
      });
      patchReel(reelId, { [countField]: reel?.[countField] || 0 });
      setMessage(error.message);
    }
  };

  const share = async (reel) => {
    const url = `${window.location.origin}/reels?reel=${reel.id}`;
    if (navigator.share) {
      await navigator.share({ title: 'TourNet Reel', text: reel.caption || 'Watch this travel Reel', url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setMessage('Reel link copied!');
  };

  const removeReel = async (reel) => {
    if (!user || user.id !== reel.user_id) return setMessage('Only the creator can delete this Reel.');
    if (!window.confirm('Delete this Reel?')) return;
    try {
      await deleteReel(reel, user.id);
      setReels((previous) => previous.filter((item) => item.id !== reel.id));
      setActive((value) => Math.max(0, value - 1));
      setMessage('Reel deleted.');
    } catch (err) {
      setMessage(err.message || 'Could not delete Reel.');
    }
  };

  const current = reels[active];
  const currentProfile = current ? profiles.get(current.user_id) : null;

  return (
    <section className="travel-reels" id="travel-reels">
      <header>
        <div><span>TRAVEL STORIES</span><h2>TRAVEL REELS</h2><p>Discover the world through travelers' eyes.</p></div>
        <button className="reel-primary" type="button" onClick={() => user ? setShowCreate(true) : setMessage('Sign in to create a Reel.')}>
          <span className="material-symbols-outlined">add_circle</span>
          Create Reel
        </button>
      </header>

      {message && <div className="reel-toast">{message}</div>}

      {loading && <div className="reel-skeleton"><div /><p>Loading Reels...</p></div>}

      {!loading && loadError && (
        <div className="reel-error">
          <b>Couldn't load Reels.</b>
          <p>{loadError}</p>
          <button type="button" onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !loadError && !current && (
        <div className="reel-empty">
          <h3>No travel Reels yet.</h3>
          <p>Be the first traveler to share your journey!</p>
          <button className="reel-primary" type="button" onClick={() => user ? setShowCreate(true) : setMessage('Sign in to create a Reel.')}>Create Reel</button>
        </div>
      )}

      {!loading && !loadError && current && (
        <>
          <div className="reel-stage">
            <article className="reel-card">
              <ReelVideo reel={current} isActive />
              <div className="reel-gradient" />
              <div className="reel-creator">
                {currentProfile?.avatar_url ? <img className="avatar" src={currentProfile.avatar_url} alt="" /> : <div className="avatar">{profileName(currentProfile).charAt(0)}</div>}
                <div><b>{profileName(currentProfile)}</b><small>{username(currentProfile, current.user_id)} · {current.location || 'Traveling'}</small></div>
              </div>
              <div className="reel-copy">
                <p>{current.caption}</p>
                <small>{(current.hashtags || []).map((tag) => `#${tag}`).join(' ')}</small>
                <small>{current.location || 'Traveling'} · {formatCount(current.views_count)} views</small>
              </div>
              <aside>
                <button type="button" className={liked.has(current.id) ? 'is-active' : ''} aria-label={liked.has(current.id) ? 'Unlike Reel' : 'Like Reel'} title={liked.has(current.id) ? 'Unlike' : 'Like'} onClick={() => toggle('reel_likes', current.id, liked, setLiked, 'likes_count')}><span className="material-symbols-outlined">favorite</span><small>{formatCount(current.likes_count)}</small></button>
                <button type="button" aria-label="Open comments" title="Comments" onClick={() => setCommentsReel(current)}><span className="material-symbols-outlined">chat_bubble</span><small>{formatCount(current.comments_count)}</small></button>
                <button type="button" className={saved.has(current.id) ? 'is-active' : ''} aria-label={saved.has(current.id) ? 'Unsave Reel' : 'Save Reel'} title={saved.has(current.id) ? 'Unsave' : 'Save'} onClick={() => toggle('reel_saves', current.id, saved, setSaved, 'saves_count')}><span className="material-symbols-outlined">bookmark</span><small>{formatCount(current.saves_count)}</small></button>
                <button type="button" aria-label="Share Reel" title="Share" onClick={() => share(current)}><span className="material-symbols-outlined">ios_share</span></button>
                <button type="button" onClick={async () => {
                  if (!user) return setMessage('Sign in to report or manage Reels.');
                  if (user.id === current.user_id) return removeReel(current);
                  return reportReel(current.id, user.id).then(() => setMessage('Reel reported.')).catch((err) => setMessage(err.message));
                }} aria-label={user?.id === current.user_id ? 'Delete Reel' : 'Report Reel'} title={user?.id === current.user_id ? 'Delete' : 'Report'}><span className="material-symbols-outlined">{user?.id === current.user_id ? 'delete' : 'more_horiz'}</span></button>
              </aside>
            </article>
          </div>
          <div className="reel-nav">
            <button disabled={active === 0} onClick={() => setActive((value) => value - 1)}>Previous</button>
            <span>{active + 1} / {reels.length}</span>
            <button disabled={active >= reels.length - 1} onClick={() => setActive((value) => value + 1)}>Next</button>
          </div>
        </>
      )}

      {showCreate && <CreateReelModal user={user} onClose={() => setShowCreate(false)} onCreated={(reel) => { setReels((previous) => [reel, ...previous]); setActive(0); load(); }} />}
      {commentsReel && <CommentsModal reel={commentsReel} user={user} onClose={() => setCommentsReel(null)} onCountChange={(delta) => patchReel(commentsReel.id, { comments_count: Math.max(0, Number(commentsReel.comments_count || 0) + delta) })} />}
    </section>
  );
}
