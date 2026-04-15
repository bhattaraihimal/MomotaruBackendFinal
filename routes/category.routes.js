const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// GET all categories (public)
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { menus: true }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single category
router.get('/:id', async (req, res) => {
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { menus: true }
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE category (admin)
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, image } = req.body;

        const category = await prisma.category.create({
            data: { name, description, image }
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE category
router.put('/:id', protect, async (req, res) => {
    try {
        const { name, description, image } = req.body;

        const updated = await prisma.category.update({
            where: { id: parseInt(req.params.id) },
            data: { name, description, image }
        });

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE category
router.delete('/:id', protect, async (req, res) => {
    try {
        await prisma.category.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;