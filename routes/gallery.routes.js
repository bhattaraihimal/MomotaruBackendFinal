const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// GET /api/gallery (Public - active)
router.get('/', async (req, res) => {
  try {
    const images = await prisma.gallery.findMany({
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
    const images = await prisma.gallery.findMany();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/gallery (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const created = await prisma.gallery.create({
      data: req.body
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/gallery/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.gallery.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (Toggle active)
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await prisma.gallery.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
