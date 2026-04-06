const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// Get all team members
router.get('/', async (req, res) => {
  try {
    const team = await prisma.team.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new team member
router.post('/', protect, async (req, res) => {
  try {
    const newTeamMember = await prisma.team.create({
      data: req.body
    });
    res.status(201).json(newTeamMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update team member
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedTeamMember = await prisma.team.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(updatedTeamMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete team member
router.delete('/:id', protect, async (req, res) => {
  try {
    await prisma.team.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Team member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
