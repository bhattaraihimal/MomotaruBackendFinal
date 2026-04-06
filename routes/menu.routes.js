const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// GET /api/menu (Public)
router.get('/', async (req, res) => {
  try {
    const menuItems = await prisma.menu.findMany({
      where: { available: true }
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/menu/all (Admin - View all including unavailable)
router.get('/all', protect, async (req, res) => {
  try {
    const menuItems = await prisma.menu.findMany();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/menu (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.category) {
        data.category = data.category.replace(' ', '_');
    }
    const createdItem = await prisma.menu.create({
      data: data
    });
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/menu/:id (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.category) {
        data.category = data.category.replace(' ', '_');
    }
    const updatedItem = await prisma.menu.update({
      where: { id: parseInt(req.params.id) },
      data: data
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/menu/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.menu.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
