const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// GET /api/branches (Public)
router.get('/', async (req, res) => {
  try {
    const branches = await prisma.branch.findMany();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/branches (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const created = await prisma.branch.create({
      data: req.body
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/branches/:id (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await prisma.branch.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/branches/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.branch.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Branch removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
