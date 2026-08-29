const pool = require('../config/db');

async function follow(followerId, followingId) {
  await pool.query(
    `INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)`,
    [followerId, followingId]
  );
}

async function unfollow(followerId, followingId) {
  await pool.query(
    `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
    [followerId, followingId]
  );
}

async function getFollowers(userId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.name, u.profile_image AS profileImage
     FROM follows f JOIN users u ON u.id = f.follower_id
     WHERE f.following_id = ? ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
}

async function getFollowing(userId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.name, u.profile_image AS profileImage
     FROM follows f JOIN users u ON u.id = f.following_id
     WHERE f.follower_id = ? ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
}

module.exports = { follow, unfollow, getFollowers, getFollowing };
