const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middlewares/auth.middleware');

// Setup multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

const Media = require('../models/Media');

router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  try {
    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user ? req.user._id : undefined
    });

    await media.save();

    res.status(200).json({
      message: 'Image uploaded successfully',
      data: {
        image_url: media.url,
        media: media
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving media', error });
  }
});

const uploadVideo = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      cb(null, `video-${Date.now()}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only videos are allowed'));
    }
  }
});

router.post('/video', protect, uploadVideo.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No video uploaded' });
  }
  try {
    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user ? req.user._id : undefined
    });
    await media.save();
    res.status(200).json({
      message: 'Video uploaded successfully',
      data: { video_url: media.url, media }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving video', error });
  }
});

module.exports = router;
