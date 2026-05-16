const express = require('express');
const Content = require('../models/Content');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Public: Get content by key
router.get('/:key', async (req, res) => {
  try {
    const content = await Content.findOne({ key: req.params.key });
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public: Get all content (for SSR)
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find();
    const result = {};
    contents.forEach(c => { result[c.key] = c.value; });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Upsert content
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const { value, type } = req.body;
    const content = await Content.findOneAndUpdate(
      { key: req.params.key },
      { value, type: type || 'text', updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete content
router.delete('/:key', authMiddleware, async (req, res) => {
  try {
    await Content.findOneAndDelete({ key: req.params.key });
    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
