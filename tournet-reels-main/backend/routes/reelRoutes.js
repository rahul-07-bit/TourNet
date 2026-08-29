const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');
const commentController = require('../controllers/commentController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { videoUpload } = require('../middleware/upload');

// Order matters: specific paths before /:id
router.get('/search', optionalAuth, reelController.searchReels);
router.get('/', optionalAuth, reelController.getFeed);
router.post('/', requireAuth, videoUpload.single('video'), reelController.uploadReel);

router.get('/:id', optionalAuth, reelController.getReel);
router.delete('/:id', requireAuth, reelController.deleteReel);

router.post('/:id/like', requireAuth, reelController.likeReel);
router.delete('/:id/like', requireAuth, reelController.unlikeReel);
router.get('/:id/likes', reelController.getLikes);

router.post('/:id/save', requireAuth, reelController.saveReel);
router.delete('/:id/save', requireAuth, reelController.unsaveReel);

router.get('/:id/comments', commentController.getComments);
router.post('/:id/comments', requireAuth, commentController.addComment);

module.exports = router;
