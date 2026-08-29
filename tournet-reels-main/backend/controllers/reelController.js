const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const reelModel = require('../models/reelModel');
const cloudinaryService = require('../services/cloudinaryService');

function viewerId(req) {
  return req.user ? req.user.id : 0;
}

const getFeed = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 30);
  const reels = await reelModel.getFeed({ page, limit, viewerId: viewerId(req) });
  return success(res, 'Reel feed fetched.', { reels, page, limit });
});

const getReel = asyncHandler(async (req, res) => {
  const reel = await reelModel.getById(req.params.id, viewerId(req));
  if (!reel) return error(res, 'Reel not found.', 404);
  return success(res, 'Reel fetched.', { reel });
});

const searchReels = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return success(res, 'Search results fetched.', { reels: [] });
  const reels = await reelModel.search(q, viewerId(req));
  return success(res, 'Search results fetched.', { reels });
});

const uploadReel = asyncHandler(async (req, res) => {
  if (!req.file) return error(res, 'A video file is required.', 400);

  const { caption = '', hashtags = '', location = '' } = req.body;

  const normalizedHashtags = hashtags
    .split(/[\s,]+/)
    .map((tag) => tag.replace(/^#/, '').trim())
    .filter(Boolean)
    .join(',');

  const uploaded = await cloudinaryService.uploadReelVideo(req.file.buffer);

  const reelId = await reelModel.createReel({
    userId: req.user.id,
    videoUrl: uploaded.videoUrl,
    thumbnailUrl: uploaded.thumbnailUrl,
    cloudinaryId: uploaded.publicId,
    caption,
    hashtags: normalizedHashtags,
    location
  });

  const reel = await reelModel.getById(reelId, req.user.id);
  return success(res, 'Reel uploaded successfully.', { reel }, 201);
});

const deleteReel = asyncHandler(async (req, res) => {
  const owner = await reelModel.getOwner(req.params.id);
  if (!owner) return error(res, 'Reel not found.', 404);
  if (owner.userId !== req.user.id) return error(res, 'You can only delete your own reels.', 403);

  await cloudinaryService.deleteAsset(owner.cloudinaryId, 'video');
  await reelModel.deleteReel(req.params.id);
  return success(res, 'Reel deleted successfully.');
});

const likeReel = asyncHandler(async (req, res) => {
  await reelModel.addLike(req.user.id, req.params.id);
  const reel = await reelModel.getById(req.params.id, req.user.id);
  return success(res, 'Reel liked.', { likesCount: reel.likesCount, likedByMe: true });
});

const unlikeReel = asyncHandler(async (req, res) => {
  await reelModel.removeLike(req.user.id, req.params.id);
  const reel = await reelModel.getById(req.params.id, req.user.id);
  return success(res, 'Reel unliked.', { likesCount: reel.likesCount, likedByMe: false });
});

const getLikes = asyncHandler(async (req, res) => {
  const likes = await reelModel.getLikes(req.params.id);
  return success(res, 'Likes fetched.', { likes });
});

const saveReel = asyncHandler(async (req, res) => {
  await reelModel.addSave(req.user.id, req.params.id);
  return success(res, 'Reel saved.', { savedByMe: true });
});

const unsaveReel = asyncHandler(async (req, res) => {
  await reelModel.removeSave(req.user.id, req.params.id);
  return success(res, 'Reel removed from saved.', { savedByMe: false });
});

const getMySaved = asyncHandler(async (req, res) => {
  const reels = await reelModel.getSavedByUser(req.user.id);
  return success(res, 'Saved reels fetched.', { reels });
});

module.exports = {
  getFeed, getReel, searchReels, uploadReel, deleteReel,
  likeReel, unlikeReel, getLikes, saveReel, unsaveReel, getMySaved
};
