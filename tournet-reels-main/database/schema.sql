-- ============================================================
-- TourNet Reels Module — MySQL Schema
-- Run this once against an empty database:
--   mysql -u root -p tournet < database/schema.sql
-- ============================================================

USE defaultdb;
-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100)  NOT NULL,
  username        VARCHAR(50)   NOT NULL UNIQUE,
  email           VARCHAR(150)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NOT NULL,
  profile_image   VARCHAR(500)  DEFAULT NULL,
  bio             VARCHAR(255)  DEFAULT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_users_username ON users (username);

-- ------------------------------------------------------------
-- reels
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reels (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  video_url       VARCHAR(500) NOT NULL,
  thumbnail_url   VARCHAR(500) DEFAULT NULL,
  cloudinary_id   VARCHAR(255) DEFAULT NULL,
  caption         TEXT,
  hashtags        VARCHAR(500) DEFAULT NULL,   -- stored as comma-separated string, e.g. "travel,manali,mountains"
  location        VARCHAR(150) DEFAULT NULL,
  likes_count     INT NOT NULL DEFAULT 0,
  comments_count  INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_reels_user_id ON reels (user_id);
CREATE INDEX idx_reels_created_at ON reels (created_at DESC);
CREATE INDEX idx_reels_location ON reels (location);

-- ------------------------------------------------------------
-- likes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS likes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  reel_id     INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_reel_like (user_id, reel_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reel_id) REFERENCES reels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_likes_reel_id ON likes (reel_id);

-- ------------------------------------------------------------
-- comments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  reel_id       INT NOT NULL,
  comment_text  VARCHAR(500) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reel_id) REFERENCES reels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_comments_reel_id ON comments (reel_id);

-- ------------------------------------------------------------
-- saved_reels
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_reels (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  reel_id     INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_reel_save (user_id, reel_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reel_id) REFERENCES reels(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_saved_user_id ON saved_reels (user_id);

-- ------------------------------------------------------------
-- follows
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS follows (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  follower_id   INT NOT NULL,   -- the user who clicks "Follow"
  following_id  INT NOT NULL,   -- the user being followed
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_follow_pair (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (follower_id <> following_id)
) ENGINE=InnoDB;

CREATE INDEX idx_follows_follower ON follows (follower_id);
CREATE INDEX idx_follows_following ON follows (following_id);
