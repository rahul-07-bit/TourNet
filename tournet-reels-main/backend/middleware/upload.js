const multer = require('multer');

const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB

const storage = multer.memoryStorage();

const videoUpload = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      return cb(new Error('Unsupported video format. Use MP4, MOV, WEBM or MKV.'));
    }
    cb(null, true);
  }
});

const imageUpload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new Error('Unsupported image format. Use JPG, PNG or WEBP.'));
    }
    cb(null, true);
  }
});

module.exports = { videoUpload, imageUpload };
