const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const { protect } = require('../middleware');

// GET /api/menu (Public)
router.get('/', async (req, res) => {
  try {
    const menuItems = await Menu.find({ available: true });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/menu/all (Admin - View all including unavailable)
router.get('/all', protect, async (req, res) => {
  try {
    const menuItems = await Menu.find({});
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/menu (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const menuItem = new Menu(req.body);
    const createdItem = await menuItem.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/menu/:id (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (menuItem) {
      Object.assign(menuItem, req.body);
      const updatedItem = await menuItem.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/menu/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (menuItem) {
        await menuItem.deleteOne();
        res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
