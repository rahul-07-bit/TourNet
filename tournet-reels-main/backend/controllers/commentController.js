const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const commentModel = require('../models/commentModel');
const reelModel = require('../models/reelModel');

const getComments = asyncHandler(async (req, res) => {
  const reel = await reelModel.getOwner(req.params.id);
  if (!reel) return error(res, 'Reel not found.', 404);
  const comments = await commentModel.getByReel(req.params.id);
  return success(res, 'Comments fetched.', { comments });
});

const addComment = asyncHandler(async (req, res) => {
  const text = (req.body.text || '').trim();
  if (!text) return error(res, 'Comment text is required.', 400);
  if (text.length > 500) return error(res, 'Comment is too long (max 500 characters).', 400);

  const reel = await reelModel.getOwner(req.params.id);
  if (!reel) return error(res, 'Reel not found.', 404);

  const commentId = await commentModel.addComment(req.user.id, req.params.id, text);
  const comments = await commentModel.getByReel(req.params.id);
  const comment = comments.find((c) => c.id === commentId);

  return success(res, 'Comment added.', { comment }, 201);
});

const deleteComment = asyncHandler(async (req, res) => {
  const record = await commentModel.getOwnerAndReel(req.params.commentId);
  if (!record) return error(res, 'Comment not found.', 404);
  if (record.userId !== req.user.id) return error(res, 'You can only delete your own comments.', 403);

  await commentModel.deleteComment(req.params.commentId, record.reelId);
  return success(res, 'Comment deleted.');
});

module.exports = { getComments, addComment, deleteComment };
