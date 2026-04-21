const express = require('express');
const router = express.Router();
const { Contact } = require('../config/db');
const { protect } = require('../middleware');
const { sendBookingNotification } = require('../utils/emailService');

// POST /api/contact (Public)
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    // Send email notification
    await sendBookingNotification(req.body);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/contact (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/contact/:id (Mark read)
router.put('/:id', protect, async (req, res) => {
  try {
    const [updatedCount] = await Contact.update(
      { read: req.body.read !== undefined ? req.body.read : true },
      { where: { id: parseInt(req.params.id) } }
    );
    if (updatedCount > 0) {
      const updated = await Contact.findByPk(req.params.id);
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
