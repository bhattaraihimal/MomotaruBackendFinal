const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// GET all timeline entries
router.get('/', async (req, res) => {
    try {
        const timeline = await prisma.timeline.findMany({
            orderBy: { year: 'asc' }
        });
        res.json(timeline);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE timeline entry (admin)
router.post('/', protect, async (req, res) => {
    try {
        const { year, topic, description, image } = req.body;
        const entry = await prisma.timeline.create({
            data: { year, topic, description, image }
        });
        res.status(201).json(entry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE timeline entry
router.put('/:id', protect, async (req, res) => {
    try {
        const { year, topic, description, image } = req.body;
        const updated = await prisma.timeline.update({
            where: { id: parseInt(req.params.id) },
            data: { year, topic, description, image }
        });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE timeline entry
router.delete('/:id', protect, async (req, res) => {
    try {
        await prisma.timeline.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
