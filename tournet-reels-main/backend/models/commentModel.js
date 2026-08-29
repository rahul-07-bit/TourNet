const pool = require('../config/db');

async function addComment(userId, reelId, text) {
  const [result] = await pool.query(
    `INSERT INTO comments (user_id, reel_id, comment_text) VALUES (?, ?, ?)`,
    [userId, reelId, text]
  );
  await pool.query(
    `UPDATE reels SET comments_count = (SELECT COUNT(*) FROM comments WHERE reel_id = ?) WHERE id = ?`,
    [reelId, reelId]
  );
  return result.insertId;
}

async function getByReel(reelId) {
  const [rows] = await pool.query(
    `SELECT c.id, c.comment_text AS text, c.created_at AS createdAt,
            u.id AS userId, u.username, u.name, u.profile_image AS profileImage
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.reel_id = ?
     ORDER BY c.created_at ASC`,
    [reelId]
  );
  return rows;
}

async function getOwnerAndReel(commentId) {
  const [rows] = await pool.query(
    `SELECT user_id AS userId, reel_id AS reelId FROM comments WHERE id = ?`,
    [commentId]
  );
  return rows[0] || null;
}

async function deleteComment(commentId, reelId) {
  await pool.query(`DELETE FROM comments WHERE id = ?`, [commentId]);
  await pool.query(
    `UPDATE reels SET comments_count = (SELECT COUNT(*) FROM comments WHERE reel_id = ?) WHERE id = ?`,
    [reelId, reelId]
  );
}

module.exports = { addComment, getByReel, getOwnerAndReel, deleteComment };
