/**
 * Seeds the database with demo data so the Reels feed isn't empty on first run.
 * Usage:  npm run seed   (from /backend, after schema.sql has been applied)
 *
 * Uses free, publicly-hosted sample videos (Google's GTV test clips) as
 * stand-ins for real travel footage — swap these for real Cloudinary
 * uploads once you're uploading your own reels through the app.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const SAMPLE_VIDEOS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
];

const USERS = [
  { name: 'Rahul Sharma', username: 'rahul_travels', email: 'rahul@tournet.demo', bio: 'Chasing mountains 🏔️ | Himachal & beyond' },
  { name: 'Ayesha Khan', username: 'ayesha_wanders', email: 'ayesha@tournet.demo', bio: 'Backpacker · storyteller · chai enthusiast' },
  { name: 'Marco Rossi', username: 'marco_roams', email: 'marco@tournet.demo', bio: 'Slow travel across South Asia 🚂' },
  { name: 'Priya Nair', username: 'priya_explores', email: 'priya@tournet.demo', bio: 'Beaches, backwaters & everything Kerala' },
  { name: 'Dev Patel', username: 'dev_on_the_road', email: 'dev@tournet.demo', bio: 'Road trips & desert sunsets 🏜️' }
];

const REELS = [
  { caption: 'Sunrise trek to the top of Triund 🌄', hashtags: 'travel,manali,mountains,trekking', location: 'Manali, India' },
  { caption: 'Lost in the blue lanes of Jodhpur', hashtags: 'travel,rajasthan,jodhpur,bluecity', location: 'Jodhpur, India' },
  { caption: 'Backwater cruise through Alleppey 🛶', hashtags: 'travel,kerala,backwaters,houseboat', location: 'Alleppey, India' },
  { caption: 'Camping under the stars in Jaisalmer desert', hashtags: 'travel,desert,camping,rajasthan', location: 'Jaisalmer, India' },
  { caption: 'Tea gardens of Munnar at golden hour', hashtags: 'travel,munnar,teagarden,kerala', location: 'Munnar, India' },
  { caption: 'The ghats of Varanasi at dawn', hashtags: 'travel,varanasi,ganga,culture', location: 'Varanasi, India' },
  { caption: 'Paragliding over Bir Billing 🪂', hashtags: 'travel,birbilling,paragliding,adventure', location: 'Bir, India' },
  { caption: 'Snow-capped Rohtang Pass road trip', hashtags: 'travel,rohtangpass,roadtrip,himachal', location: 'Rohtang, India' },
  { caption: 'Sunset over Marine Drive', hashtags: 'travel,mumbai,sunset,marinedrive', location: 'Mumbai, India' },
  { caption: 'Exploring the caves of Ajanta & Ellora', hashtags: 'travel,ajanta,ellora,heritage', location: 'Aurangabad, India' }
];

async function seed() {
  console.log('Seeding TourNet demo data...');

  const passwordHash = await bcrypt.hash('password123', 10);
  const userIds = [];

  for (const u of USERS) {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [u.email]);
    if (existing.length) {
      userIds.push(existing[0].id);
      continue;
    }
    const [result] = await pool.query(
      `INSERT INTO users (name, username, email, password_hash, bio, profile_image) VALUES (?, ?, ?, ?, ?, ?)`,
      [u.name, u.username, u.email, passwordHash, u.bio, `https://i.pravatar.cc/150?u=${u.username}`]
    );
    userIds.push(result.insertId);
  }
  console.log(`✅ ${userIds.length} demo users ready.`);

  const reelIds = [];
  for (let i = 0; i < REELS.length; i++) {
    const r = REELS[i];
    const creatorId = userIds[i % userIds.length];
    const videoUrl = SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length];
    const [result] = await pool.query(
      `INSERT INTO reels (user_id, video_url, thumbnail_url, caption, hashtags, location)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [creatorId, videoUrl, null, r.caption, r.hashtags, r.location]
    );
    reelIds.push(result.insertId);
  }
  console.log(`✅ ${reelIds.length} demo reels created.`);

  // Random likes + comments + saves so counts aren't all zero.
  const sampleComments = [
    'This is stunning! 😍', 'Adding this to my bucket list.', 'How did you get there?',
    'Absolutely gorgeous view.', 'Take me with you next time!', 'Wow, the colors are incredible.'
  ];

  for (const reelId of reelIds) {
    for (const userId of userIds) {
      if (Math.random() > 0.4) {
        await pool.query('INSERT IGNORE INTO likes (user_id, reel_id) VALUES (?, ?)', [userId, reelId]);
      }
      if (Math.random() > 0.7) {
        const text = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        await pool.query('INSERT INTO comments (user_id, reel_id, comment_text) VALUES (?, ?, ?)', [userId, reelId, text]);
      }
      if (Math.random() > 0.8) {
        await pool.query('INSERT IGNORE INTO saved_reels (user_id, reel_id) VALUES (?, ?)', [userId, reelId]);
      }
    }
    await pool.query('UPDATE reels SET likes_count = (SELECT COUNT(*) FROM likes WHERE reel_id = ?) WHERE id = ?', [reelId, reelId]);
    await pool.query('UPDATE reels SET comments_count = (SELECT COUNT(*) FROM comments WHERE reel_id = ?) WHERE id = ?', [reelId, reelId]);
  }
  console.log('✅ Likes, comments and saves generated.');

  // A couple of follow relationships.
  for (let i = 0; i < userIds.length; i++) {
    const next = userIds[(i + 1) % userIds.length];
    await pool.query('INSERT IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)', [userIds[i], next]);
  }
  console.log('✅ Follow relationships created.');

  console.log('\nSeed complete. Demo login for any user: <email> / password123');
  console.log(USERS.map((u) => u.email).join('\n'));

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
