const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware');

// GET /api/gallery (Public - active)
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find({ active: true });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/gallery/all (Admin)
router.get('/all', protect, async (req, res) => {
  try {
    const images = await Gallery.find({});
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/gallery (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const image = new Gallery(req.body);
    const created = await image.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/gallery/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (image) {
      await image.deleteOne();
      res.json({ message: 'Removed' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (Toggle active)
router.put('/:id', protect, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (image) {
      Object.assign(image, req.body);
      const updated = await image.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
