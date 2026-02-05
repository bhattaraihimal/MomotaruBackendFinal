const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect } = require('../middleware');

// GET /api/testimonials (Public - only active)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/testimonials/all (Admin - all)
router.get('/all', protect, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({});
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/testimonials (Public/Admin? - assume Admin for now as public submission wasn't explicitly requested as public feature except in generic sense, but usually users submit elsewhere. Project spec says "Admin-managed" but "Testimonials (Dynamic)" implies display. Let's allow Admin to add.)
// Actually, usually customers submit via a form, but let's stick to Admin adding them manually or approving them. I'll add a create route protected for now, or open if needed. Spec says "Admin-managed" for content.
router.post('/', protect, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    const created = await testimonial.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/testimonials/:id (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      Object.assign(testimonial, req.body);
      const updated = await testimonial.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/testimonials/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ message: 'Removed' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
