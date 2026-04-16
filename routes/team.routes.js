const express = require('express');
const router = express.Router();
const { Team } = require('../config/db');
const { protect } = require('../middleware');

// Get all team members
router.get('/', async (req, res) => {
  try {
    const team = await Team.findAll({
      order: [['order', 'ASC']]
    });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new team member
router.post('/', protect, async (req, res) => {
  try {
    const newTeamMember = await Team.create(req.body);
    res.status(201).json(newTeamMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update team member
router.put('/:id', protect, async (req, res) => {
  try {
    const [updatedCount] = await Team.update(req.body, {
      where: { id: parseInt(req.params.id) }
    });
    if (updatedCount > 0) {
      const updatedTeamMember = await Team.findByPk(req.params.id);
      res.json(updatedTeamMember);
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete team member
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedCount = await Team.destroy({
      where: { id: parseInt(req.params.id) }
    });
    if (deletedCount > 0) {
      res.json({ message: 'Team member deleted' });
    } else {
      res.status(404).json({ message: 'Team member not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
