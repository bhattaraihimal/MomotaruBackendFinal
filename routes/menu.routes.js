const express = require('express');
const router = express.Router();
const { Menu, Category } = require('../config/db');
const { protect } = require('../middleware');

// GET /api/menu (Public)
router.get('/', async (req, res) => {
  try {
    const menuItems = await Menu.findAll({
      where: { available: true },
      include: [{ model: Category, as: 'category' }]
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/menu/all (Admin - View all including unavailable)
router.get('/all', protect, async (req, res) => {
  try {
    const menuItems = await Menu.findAll({
      include: [{ model: Category, as: 'category' }]
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

    const createdItem = await Menu.create({
      name,
      description,
      price: parseFloat(price),
      available,
      image,
      categoryId: parseInt(categoryId)
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

    const [updatedCount] = await Menu.update(updateData, {
      where: { id: parseInt(req.params.id) }
    });

    if (updatedCount > 0) {
      const updatedItem = await Menu.findByPk(req.params.id);
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
    const deletedCount = await Menu.destroy({
      where: { id: parseInt(req.params.id) }
    });
    if (deletedCount > 0) {
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
