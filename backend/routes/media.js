const express = require('express');
const authMiddleware = require('../middleware/auth');
const { uploadImage, uploadVideo, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// Admin: Upload image
router.post('/image', authMiddleware, uploadImage.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({
      url: req.file.path,
      publicId: req.file.filename,
      format: req.file.format,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Upload video
router.post('/video', authMiddleware, uploadVideo.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete media from Cloudinary
router.delete('/:publicId', authMiddleware, async (req, res) => {
  try {
    const { resourceType = 'image' } = req.query;
    const publicId = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get Cloudinary media list
router.get('/list/:folder', authMiddleware, async (req, res) => {
  try {
    const { folder } = req.params;
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `portfolio/${folder}`,
      max_results: 50
    });
    res.json(result.resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
