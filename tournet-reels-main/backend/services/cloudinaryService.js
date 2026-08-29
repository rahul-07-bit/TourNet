const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

function uploadBuffer(buffer, { folder, resourceType }) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

// Uploads a reel video, returns { videoUrl, thumbnailUrl, publicId }.
// Cloudinary auto-generates a JPG thumbnail from the video for us.
async function uploadReelVideo(buffer) {
  const result = await uploadBuffer(buffer, { folder: 'tournet/reels', resourceType: 'video' });
  const thumbnailUrl = cloudinary.url(result.public_id, {
    resource_type: 'video',
    format: 'jpg',
    start_offset: '0'
  });
  return { videoUrl: result.secure_url, thumbnailUrl, publicId: result.public_id };
}

async function uploadProfileImage(buffer) {
  const result = await uploadBuffer(buffer, { folder: 'tournet/profiles', resourceType: 'image' });
  return { imageUrl: result.secure_url, publicId: result.public_id };
}

async function deleteAsset(publicId, resourceType = 'video') {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

module.exports = { uploadReelVideo, uploadProfileImage, deleteAsset };
