const express = require('express');
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');
const { uploadVideo, cloudinary } = require('../config/cloudinary');
const multer = require('multer');
const router = express.Router();

// Public: Get approved reviews
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = { status: 'approved' };
    if (featured === 'true') filter.featured = true;

    const reviews = await Review.find(filter).sort({ pinned: -1, createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public: Submit review (with optional video)
router.post('/', uploadVideo.single('video'), async (req, res) => {
  try {
    const { name, email, review, rating } = req.body;
    if (!name || !email || !review || !rating) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const reviewData = {
      name,
      email,
      review,
      rating: parseInt(rating),
      status: 'pending'
    };

    if (req.file) {
      reviewData.video = { url: req.file.path, publicId: req.file.filename };
    }

    const newReview = new Review(reviewData);
    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all reviews
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update review status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Toggle featured/pinned
router.patch('/:id/feature', authMiddleware, async (req, res) => {
  try {
    const { featured, pinned } = req.body;
    const update = {};
    if (featured !== undefined) update.featured = featured;
    if (pinned !== undefined) update.pinned = pinned;
    const review = await Review.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Edit review
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, review, rating } = req.body;
    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { name, review, rating },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete review
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.video?.publicId) {
      await cloudinary.uploader.destroy(review.video.publicId, { resource_type: 'video' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
