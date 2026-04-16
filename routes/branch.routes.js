const express = require('express');
const router = express.Router();
const { Branch } = require('../config/db');
const { protect } = require('../middleware');

// GET /api/branches (Public)
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.findAll();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/branches (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const created = await Branch.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/branches/:id (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const [updatedCount, updatedBranches] = await Branch.update(req.body, {
      where: { id: parseInt(req.params.id) },
      returning: true // not all dialects support this, but for simplicity we'll just return the updated object after fetching if needed, or just the body
    });
    
    // Sequelize update returns count. Let's find and return the object to match prisma behavior if possible, or just the body.
    if (updatedCount > 0) {
      const updated = await Branch.findByPk(req.params.id);
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/branches/:id (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedCount = await Branch.destroy({
      where: { id: parseInt(req.params.id) }
    });
    if (deletedCount > 0) {
      res.json({ message: 'Branch removed' });
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
