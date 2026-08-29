const pool = require('../config/db');

async function createUser({ name, username, email, passwordHash }) {
  const [result] = await pool.query(
    `INSERT INTO users (name, username, email, password_hash) VALUES (?, ?, ?, ?)`,
    [name, username, email, passwordHash]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0] || null;
}

async function findByUsername(username) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function updateProfileImage(userId, imageUrl) {
  await pool.query(`UPDATE users SET profile_image = ? WHERE id = ?`, [imageUrl, userId]);
}

async function getFollowCounts(userId) {
  const [[followers]] = await pool.query(
    `SELECT COUNT(*) AS count FROM follows WHERE following_id = ?`, [userId]
  );
  const [[following]] = await pool.query(
    `SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?`, [userId]
  );
  const [[reelCount]] = await pool.query(
    `SELECT COUNT(*) AS count FROM reels WHERE user_id = ?`, [userId]
  );
  return { followers: followers.count, following: following.count, reelCount: reelCount.count };
}

async function isFollowing(followerId, followingId) {
  const [rows] = await pool.query(
    `SELECT id FROM follows WHERE follower_id = ? AND following_id = ?`,
    [followerId, followingId]
  );
  return rows.length > 0;
}

module.exports = {
  createUser,
  findByEmail,
  findByUsername,
  findById,
  updateProfileImage,
  getFollowCounts,
  isFollowing
};
