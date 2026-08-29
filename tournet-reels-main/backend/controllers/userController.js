const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const userModel = require('../models/userModel');
const reelModel = require('../models/reelModel');
const followModel = require('../models/followModel');
const cloudinaryService = require('../services/cloudinaryService');

const getProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findByUsername(req.params.username);
  if (!user) return error(res, 'User not found.', 404);

  const counts = await userModel.getFollowCounts(user.id);
  const isFollowedByMe = req.user ? await userModel.isFollowing(req.user.id, user.id) : false;

  return success(res, 'Profile fetched.', {
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      profileImage: user.profile_image,
      createdAt: user.created_at,
      ...counts,
      isFollowedByMe
    }
  });
});

const getProfileReels = asyncHandler(async (req, res) => {
  const user = await userModel.findByUsername(req.params.username);
  if (!user) return error(res, 'User not found.', 404);
  const viewerId = req.user ? req.user.id : 0;
  const reels = await reelModel.getByUsername(req.params.username, viewerId);
  return success(res, "User's reels fetched.", { reels });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return error(res, 'An image file is required.', 400);
  const { imageUrl } = await cloudinaryService.uploadProfileImage(req.file.buffer);
  await userModel.updateProfileImage(req.user.id, imageUrl);
  return success(res, 'Profile image updated.', { profileImage: imageUrl });
});

const followUser = asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);
  if (targetId === req.user.id) return error(res, 'You cannot follow yourself.', 400);
  const target = await userModel.findById(targetId);
  if (!target) return error(res, 'User not found.', 404);

  await followModel.follow(req.user.id, targetId);
  return success(res, `You are now following ${target.username}.`, { following: true });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);
  await followModel.unfollow(req.user.id, targetId);
  return success(res, 'Unfollowed successfully.', { following: false });
});

const getFollowers = asyncHandler(async (req, res) => {
  const followers = await followModel.getFollowers(req.params.id);
  return success(res, 'Followers fetched.', { followers });
});

const getFollowing = asyncHandler(async (req, res) => {
  const following = await followModel.getFollowing(req.params.id);
  return success(res, 'Following fetched.', { following });
});

module.exports = {
  getProfile, getProfileReels, uploadAvatar,
  followUser, unfollowUser, getFollowers, getFollowing
};
