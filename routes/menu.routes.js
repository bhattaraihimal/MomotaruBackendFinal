const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// GET /api/menu (Public)
router.get('/', async (req, res) => {
  try {
    const menuItems = await prisma.menu.findMany({
      where: { available: true },
      include: { category: true }
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/menu/all (Admin - View all including unavailable)
router.get('/all', protect, async (req, res) => {
  try {
    const menuItems = await prisma.menu.findMany({
      include: { category: true }
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/menu (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, price, available, image, categoryId } = req.body;
    
    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    const createdItem = await prisma.menu.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        available,
        image,
        categoryId: parseInt(categoryId)
      }
    });
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/menu/:id (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, description, price, available, image, categoryId } = req.body;
    
    // Build update object dynamically to allow partial updates
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (available !== undefined) updateData.available = available;
    if (image !== undefined) updateData.image = image;
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);

    const updatedItem = await prisma.menu.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
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
