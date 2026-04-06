const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// GET /api/testimonials (Public - only active)
router.get('/', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true }
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/testimonials/all (Admin - all)
router.get('/all', protect, async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/testimonials (Public/Admin)
router.post('/', protect, async (req, res) => {
  try {
    const created = await prisma.testimonial.create({
      data: req.body
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/testimonials/:id (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await prisma.testimonial.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/testimonials/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.testimonial.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
