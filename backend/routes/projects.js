const express = require('express');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');
const { uploadImage, uploadVideo, cloudinary } = require('../config/cloudinary');
const router = express.Router();

// Public: Get all published projects
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get all projects
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public: Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Create project
router.post('/', authMiddleware, (req, res, next) => {
  uploadImage.single('thumbnail')(req, res, function (err) {
    if (err) {
      console.error("Multer error during project creation:", err);
      return res.status(500).json({ error: err.message || err.toString() });
    }
    next();
  });
}, async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (req.file) {
      data.thumbnail = { url: req.file.path, publicId: req.file.filename };
    }
    const project = new Project(data);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update project
router.put('/:id', authMiddleware, (req, res, next) => {
  uploadImage.single('thumbnail')(req, res, function (err) {
    if (err) {
      console.error("Multer error during project update:", err);
      return res.status(500).json({ error: err.message || err.toString() });
    }
    next();
  });
}, async (req, res) => {
  try {
    const data = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
    if (req.file) {
      data.thumbnail = { url: req.file.path, publicId: req.file.filename };
    }
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Delete media from Cloudinary
    if (project.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(project.thumbnail.publicId);
    }
    if (project.video?.publicId) {
      await cloudinary.uploader.destroy(project.video.publicId, { resource_type: 'video' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Upload project video
router.post('/:id/video', authMiddleware, uploadVideo.single('video'), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { video: { url: req.file.path, publicId: req.file.filename } },
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
