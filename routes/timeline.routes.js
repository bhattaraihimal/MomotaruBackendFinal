const express = require('express');
const router = express.Router();
const { Timeline } = require('../config/db');
const { protect } = require('../middleware');

// GET all timeline entries
router.get('/', async (req, res) => {
    try {
        const timeline = await Timeline.findAll({
            order: [['year', 'ASC']]
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
        const entry = await Timeline.create({ year, topic, description, image });
        res.status(201).json(entry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE timeline entry
router.put('/:id', protect, async (req, res) => {
    try {
        const { year, topic, description, image } = req.body;
        const [updatedCount] = await Timeline.update(
            { year, topic, description, image },
            { where: { id: parseInt(req.params.id) } }
        );
        if (updatedCount > 0) {
            const updated = await Timeline.findByPk(req.params.id);
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Timeline entry not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE timeline entry
router.delete('/:id', protect, async (req, res) => {
    try {
        const deletedCount = await Timeline.destroy({
            where: { id: parseInt(req.params.id) }
        });
        if (deletedCount > 0) {
            res.json({ message: 'Entry deleted' });
        } else {
            res.status(404).json({ message: 'Timeline entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
