const express = require('express');
const router = express.Router();
const { Testimonial } = require('../config/db');
const { protect } = require('../middleware');

// GET /api/testimonials (Public - only active)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
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
    const testimonials = await Testimonial.findAll();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/testimonials (Public/Admin)
router.post('/', protect, async (req, res) => {
  try {
    const created = await Testimonial.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/testimonials/:id (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const [updatedCount] = await Testimonial.update(req.body, {
      where: { id: parseInt(req.params.id) }
    });
    if (updatedCount > 0) {
      const updated = await Testimonial.findByPk(req.params.id);
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/testimonials/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedCount = await Testimonial.destroy({
      where: { id: parseInt(req.params.id) }
    });
    if (deletedCount > 0) {
      res.json({ message: 'Removed' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
