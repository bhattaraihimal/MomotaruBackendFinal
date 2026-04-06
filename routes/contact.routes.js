const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// POST /api/contact (Public)
router.post('/', async (req, res) => {
  try {
    await prisma.contact.create({
      data: req.body
    });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/contact (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const messages = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/contact/:id (Mark read)
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await prisma.contact.update({
      where: { id: parseInt(req.params.id) },
      data: { read: req.body.read !== undefined ? req.body.read : true }
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
