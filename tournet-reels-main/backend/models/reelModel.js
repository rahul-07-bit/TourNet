const pool = require('../config/db');

// Shared SELECT used by every "return a reel with creator info" query.
// `?` placeholder for viewerId powers the `liked_by_me` / `saved_by_me` flags;
// pass 0 for anonymous viewers (0 never matches a real user_id).
const BASE_SELECT = `
  SELECT
    r.id, r.video_url AS videoUrl, r.thumbnail_url AS thumbnailUrl,
    r.caption, r.hashtags, r.location,
    r.likes_count AS likesCount, r.comments_count AS commentsCount,
    r.created_at AS createdAt,
    u.id AS creatorId, u.username AS creatorUsername,
    u.name AS creatorName, u.profile_image AS creatorProfileImage,
    EXISTS(SELECT 1 FROM likes l WHERE l.reel_id = r.id AND l.user_id = ?) AS likedByMe,
    EXISTS(SELECT 1 FROM saved_reels s WHERE s.reel_id = r.id AND s.user_id = ?) AS savedByMe
  FROM reels r
  JOIN users u ON u.id = r.user_id
`;

function shapeReel(row) {
  return {
    id: row.id,
    videoUrl: row.videoUrl,
    thumbnailUrl: row.thumbnailUrl,
    caption: row.caption,
    hashtags: row.hashtags ? row.hashtags.split(',').filter(Boolean) : [],
    location: row.location,
    likesCount: row.likesCount,
    commentsCount: row.commentsCount,
    createdAt: row.createdAt,
    likedByMe: !!row.likedByMe,
    savedByMe: !!row.savedByMe,
    creator: {
      id: row.creatorId,
      username: row.creatorUsername,
      name: row.creatorName,
      profileImage: row.creatorProfileImage
    }
  };
}

async function createReel({ userId, videoUrl, thumbnailUrl, cloudinaryId, caption, hashtags, location }) {
  const [result] = await pool.query(
    `INSERT INTO reels (user_id, video_url, thumbnail_url, cloudinary_id, caption, hashtags, location)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, videoUrl, thumbnailUrl, cloudinaryId, caption, hashtags, location]
  );
  return result.insertId;
}

// Simple v1 feed strategy: followed creators' reels first, then everything
// else by recency. (Recommendation signals can slot in here later.)
async function getFeed({ page = 1, limit = 10, viewerId = 0 }) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `${BASE_SELECT}
     ORDER BY
       (r.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)) DESC,
       r.created_at DESC
     LIMIT ? OFFSET ?`,
    [viewerId, viewerId, viewerId, limit, offset]
  );
  return rows.map(shapeReel);
}

async function getById(id, viewerId = 0) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE r.id = ?`, [viewerId, viewerId, id]);
  return rows[0] ? shapeReel(rows[0]) : null;
}

async function getByUsername(username, viewerId = 0) {
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE u.username = ? ORDER BY r.created_at DESC`,
    [viewerId, viewerId, username]
  );
  return rows.map(shapeReel);
}

async function search(q, viewerId = 0) {
  const like = `%${q}%`;
  const [rows] = await pool.query(
    `${BASE_SELECT}
     WHERE r.caption LIKE ? OR r.hashtags LIKE ? OR r.location LIKE ? OR u.username LIKE ?
     ORDER BY r.created_at DESC
     LIMIT 30`,
    [viewerId, viewerId, like, like, like, like]
  );
  return rows.map(shapeReel);
}

async function getSavedByUser(userId) {
  const [rows] = await pool.query(
    `${BASE_SELECT}
     JOIN saved_reels sv ON sv.reel_id = r.id AND sv.user_id = ?
     ORDER BY sv.created_at DESC`,
    [userId, userId, userId]
  );
  return rows.map(shapeReel);
}

async function getOwner(reelId) {
  const [rows] = await pool.query(`SELECT user_id AS userId, cloudinary_id AS cloudinaryId FROM reels WHERE id = ?`, [reelId]);
  return rows[0] || null;
}

async function deleteReel(reelId) {
  await pool.query(`DELETE FROM reels WHERE id = ?`, [reelId]);
}

// --- Likes ---
async function addLike(userId, reelId) {
  await pool.query(`INSERT IGNORE INTO likes (user_id, reel_id) VALUES (?, ?)`, [userId, reelId]);
  await pool.query(`UPDATE reels SET likes_count = (SELECT COUNT(*) FROM likes WHERE reel_id = ?) WHERE id = ?`, [reelId, reelId]);
}

async function removeLike(userId, reelId) {
  await pool.query(`DELETE FROM likes WHERE user_id = ? AND reel_id = ?`, [userId, reelId]);
  await pool.query(`UPDATE reels SET likes_count = (SELECT COUNT(*) FROM likes WHERE reel_id = ?) WHERE id = ?`, [reelId, reelId]);
}

async function getLikes(reelId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.name, u.profile_image AS profileImage
     FROM likes l JOIN users u ON u.id = l.user_id
     WHERE l.reel_id = ? ORDER BY l.created_at DESC`,
    [reelId]
  );
  return rows;
}

// --- Saves ---
async function addSave(userId, reelId) {
  await pool.query(`INSERT IGNORE INTO saved_reels (user_id, reel_id) VALUES (?, ?)`, [userId, reelId]);
}

async function removeSave(userId, reelId) {
  await pool.query(`DELETE FROM saved_reels WHERE user_id = ? AND reel_id = ?`, [userId, reelId]);
}

module.exports = {
  createReel, getFeed, getById, getByUsername, search, getSavedByUser,
  getOwner, deleteReel, addLike, removeLike, getLikes, addSave, removeSave
};
