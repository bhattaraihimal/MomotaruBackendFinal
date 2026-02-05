const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware');

// POST /api/contact (Public)
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const created = await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/contact (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/contact/:id (Mark read)
router.put('/:id', protect, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (message) {
      message.read = req.body.read || true;
      const updated = await message.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
