const express = require('express');
const router = express.Router();
const { Franchise } = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware');

// POST /api/franchise - Public: Submit an inquiry
router.post('/', async (req, res) => {
  try {
    const inquiry = await Franchise.create(req.body);
    res.status(201).json(inquiry);
  } catch (error) {
    console.error('Error creating franchise inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// GET /api/franchise - Admin: Get all inquiries
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const inquiries = await Franchise.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// PUT /api/franchise/:id - Admin: Mark as read/unread
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    await Franchise.update({ read }, { where: { id } });
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE /api/franchise/:id - Admin: Delete an inquiry
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Franchise.destroy({ where: { id } });
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

module.exports = router;
