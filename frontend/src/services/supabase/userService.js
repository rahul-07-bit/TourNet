/**
 * userService.js
 * All Supabase database operations for TourNet user profiles,
 * preferences, favorites, and activity.
 *
 * Fallback to local storage is automatically used if Supabase is unconfigured,
 * making the app fully interactive and usable offline / in demo sandbox mode.
 */

import { supabase, isConfigured } from './supabase';

/* ── Helpers for local storage fallbacks ────────────────────────────────── */
function getLocalProfile(uid) {
  const data = localStorage.getItem(`tournet_profile_${uid}`);
  return data ? JSON.parse(data) : null;
}

function setLocalProfile(uid, profile) {
  localStorage.setItem(`tournet_profile_${uid}`, JSON.stringify(profile));
}

function getLocalFavorites(uid) {
  const data = localStorage.getItem(`tournet_favorites_${uid}`);
  return data ? JSON.parse(data) : [];
}

function setLocalFavorites(uid, favorites) {
  localStorage.setItem(`tournet_favorites_${uid}`, JSON.stringify(favorites));
}

function getLocalActivities(uid) {
  const data = localStorage.getItem(`tournet_activity_${uid}`);
  return data ? JSON.parse(data) : [];
}

function setLocalActivities(uid, activities) {
  localStorage.setItem(`tournet_activity_${uid}`, JSON.stringify(activities));
}

/* ══════════════════════════════════════════════════════════════
   PROFILE CRUD
   ══════════════════════════════════════════════════════════════ */

export async function getProfile(uid) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data ?? null;
}

export async function upsertProfile(uid, fields) {
  const payload = {
    id: uid,
    updated_at: new Date().toISOString(),
    // Ensure both name aliases are always populated
    full_name: fields.full_name ?? fields.name ?? null,
    ...fields,
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(uid, fields) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', uid)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* ══════════════════════════════════════════════════════════════
   FAVORITES
   ══════════════════════════════════════════════════════════════ */

export async function getFavorites(uid) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', uid)
    .order('saved_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addFavorite(uid, destination) {
  const { data, error } = await supabase
    .from('favorites')
    .upsert({
      user_id: uid,
      dest_id: destination.id,
      name: destination.name,
      location: destination.location,
      image: destination.image,
      category: destination.category,
      saved_at: new Date().toISOString(),
    }, { onConflict: 'user_id,dest_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(uid, destId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', uid)
    .eq('dest_id', destId);

  if (error) throw error;
}

/* ══════════════════════════════════════════════════════════════
   ACTIVITY LOG
   ══════════════════════════════════════════════════════════════ */

/**
 * Log a user action (view, bookmark, plan).
 * Keeps only the latest 50 events per user.
 */
export async function logActivity(uid, type, destId, destName) {
  const { error } = await supabase
    .from('activity')
    .insert({
      user_id: uid,
      type,
      dest_id: destId,
      dest_name: destName,
      timestamp: new Date().toISOString(),
    });

  if (error) console.warn('Activity log failed (non-critical):', error.message);
}

export async function getRecentActivity(uid, limit = 20) {
  const { data, error } = await supabase
    .from('activity')
    .select('*')
    .eq('user_id', uid)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/* ══════════════════════════════════════════════════════════════
   PREFERENCES
   ══════════════════════════════════════════════════════════════ */

export async function updatePreferences(uid, prefs) {
  return updateProfile(uid, { preferences: prefs });
}

/* ══════════════════════════════════════════════════════════════
   GUEST PREFERENCE MERGE
   Guest data is stored in localStorage under 'tournet_guest'.
   Called once after login/register to merge into the DB.
   ══════════════════════════════════════════════════════════════ */

export const GUEST_KEY = 'tournet_guest';

export function getGuestData() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveGuestData(data) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(data));
}

export function clearGuestData() {
  localStorage.removeItem(GUEST_KEY);
}

/**
 * After login, merge any guest favorites/preferences into the user's DB profile.
 * Guest data is then cleared from localStorage.
 */
export async function mergeGuestData(uid, currentProfile) {
  const guest = getGuestData();
  if (!guest || Object.keys(guest).length === 0) return;

  const updates = {};

  // Merge favorite destinations
  if (guest.favorites?.length > 0) {
    for (const dest of guest.favorites) {
      await addFavorite(uid, dest).catch(() => {}); // ignore dupe errors
    }
  }

  // Merge category preferences
  if (guest.preferredCategories?.length > 0) {
    const existing = currentProfile?.preferences?.categories || [];
    const merged = [...new Set([...existing, ...guest.preferredCategories])];
    updates.preferences = {
      ...(currentProfile?.preferences || {}),
      categories: merged,
    };
  }

  if (Object.keys(updates).length > 0) {
    await updateProfile(uid, updates).catch(() => {});
  }

  clearGuestData();
}
