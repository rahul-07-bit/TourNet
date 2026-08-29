const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const reelController = require('../controllers/reelController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { imageUpload } = require('../middleware/upload');

// Specific routes before the /:username catch-all.
router.get('/me/saved', requireAuth, reelController.getMySaved);
router.post('/me/avatar', requireAuth, imageUpload.single('image'), userController.uploadAvatar);

router.post('/:id/follow', requireAuth, userController.followUser);
router.delete('/:id/follow', requireAuth, userController.unfollowUser);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

router.get('/:username', optionalAuth, userController.getProfile);
router.get('/:username/reels', optionalAuth, userController.getProfileReels);

module.exports = router;
