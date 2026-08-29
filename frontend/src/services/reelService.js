import { supabase } from './supabase/supabase';

const BUCKET = 'reels';

function withReelError(error) {
  if (!error) return null;
  if (error.code === 'PGRST205' || /Could not find the table/i.test(error.message || '')) {
    return new Error('The Supabase reels tables are missing. Run the reels setup SQL migration in Supabase, then retry.');
  }
  return error;
}

export async function getReels({ from = 0, to = 9 } = {}) {
  const { data, error } = await supabase
    .from('reels')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw withReelError(error);
  return data || [];
}

export async function getProfiles(userIds) {
  const ids = [...new Set((userIds || []).filter(Boolean))];
  if (!ids.length) return new Map();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, full_name, email, avatar_url')
    .in('id', ids);

  if (error) return new Map();
  return new Map((data || []).map((profile) => [profile.id, profile]));
}

export async function getInteractions(ids, userId) {
  if (!userId || !ids.length) return { liked: new Set(), saved: new Set() };

  const [{ data: likes, error: likesError }, { data: saves, error: savesError }] = await Promise.all([
    supabase.from('reel_likes').select('reel_id').eq('user_id', userId).in('reel_id', ids),
    supabase.from('reel_saves').select('reel_id').eq('user_id', userId).in('reel_id', ids),
  ]);

  if (likesError) throw withReelError(likesError);
  if (savesError) throw withReelError(savesError);

  return {
    liked: new Set((likes || []).map((row) => row.reel_id)),
    saved: new Set((saves || []).map((row) => row.reel_id)),
  };
}

export async function toggleRelation(table, reelId, userId, active) {
  if (active) {
    return supabase.from(table).delete().eq('reel_id', reelId).eq('user_id', userId);
  }
  return supabase.from(table).insert({ reel_id: reelId, user_id: userId });
}

export async function getComments(reelId) {
  const { data, error } = await supabase
    .from('reel_comments')
    .select('*')
    .eq('reel_id', reelId)
    .order('created_at', { ascending: true });

  if (error) throw withReelError(error);
  return data || [];
}

export async function addComment(reelId, userId, content) {
  const { data, error } = await supabase
    .from('reel_comments')
    .insert({ reel_id: reelId, user_id: userId, content })
    .select()
    .single();

  if (error) throw withReelError(error);
  return data;
}

export async function deleteComment(commentId, userId) {
  const { error } = await supabase
    .from('reel_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) throw withReelError(error);
}

export async function createReel({ file, thumbnail, caption, location, hashtags, duration, userId }) {
  const id = crypto.randomUUID();
  const ext = file.name.split('.').pop().toLowerCase();
  const base = `${userId}/${id}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(`${base}/video.${ext}`, file, { contentType: file.type, upsert: false });

  if (uploadError) throw uploadError;

  let thumbnailPath = null;
  if (thumbnail) {
    const thumbExt = thumbnail.name.split('.').pop().toLowerCase();
    thumbnailPath = `${base}/thumbnail.${thumbExt}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(thumbnailPath, thumbnail, { contentType: thumbnail.type, upsert: false });
    if (error) throw error;
  }

  const { data, error } = await supabase
    .from('reels')
    .insert({
      id,
      user_id: userId,
      video_path: `${base}/video.${ext}`,
      thumbnail_path: thumbnailPath,
      caption,
      location,
      hashtags,
      duration,
    })
    .select()
    .single();

  if (error) throw withReelError(error);
  return data;
}

export async function signedUrl(path) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteReel(reel, userId) {
  const { error } = await supabase
    .from('reels')
    .delete()
    .eq('id', reel.id)
    .eq('user_id', userId);

  if (error) throw withReelError(error);

  await supabase.storage
    .from(BUCKET)
    .remove([reel.video_path, reel.thumbnail_path].filter(Boolean));
}

export async function reportReel(reelId, userId, reason = 'Other') {
  const { error } = await supabase
    .from('reel_reports')
    .insert({ reel_id: reelId, reported_by: userId, reason });

  if (error && error.code !== '23505') throw withReelError(error);
}
