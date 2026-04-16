const express = require('express');
const router = express.Router();
const { Gallery } = require('../config/db');
const { protect } = require('../middleware');

// GET /api/gallery (Public - active)
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.findAll({
      where: { active: true }
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/gallery/all (Admin)
router.get('/all', protect, async (req, res) => {
  try {
    const images = await Gallery.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/gallery (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const created = await Gallery.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/gallery/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedCount = await Gallery.destroy({
      where: { id: parseInt(req.params.id) }
    });
    if (deletedCount > 0) {
      res.json({ message: 'Removed' });
    } else {
      res.status(404).json({ message: 'Gallery item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (Toggle active)
router.put('/:id', protect, async (req, res) => {
  try {
    const [updatedCount] = await Gallery.update(req.body, {
      where: { id: parseInt(req.params.id) }
    });
    if (updatedCount > 0) {
      const updated = await Gallery.findByPk(req.params.id);
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Gallery item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
