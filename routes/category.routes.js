const express = require('express');
const router = express.Router();
const { Category, Menu } = require('../config/db');
const { protect } = require('../middleware');

// GET all categories (public)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [{ model: Menu, as: 'menus' }]
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [{ model: Menu, as: 'menus' }]
        });
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE category (admin)
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, image } = req.body;

        const category = await Category.create({ name, description, image });

        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE category
router.put('/:id', protect, async (req, res) => {
    try {
        const { name, description, image } = req.body;

        const [updatedCount] = await Category.update(
            { name, description, image },
            { where: { id: parseInt(req.params.id) } }
        );

        if (updatedCount > 0) {
            const updated = await Category.findByPk(req.params.id);
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE category
router.delete('/:id', protect, async (req, res) => {
    try {
        const deletedCount = await Category.destroy({
            where: { id: parseInt(req.params.id) }
        });

        if (deletedCount > 0) {
            res.json({ message: 'Category deleted' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;