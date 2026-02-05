const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const { protect } = require('../middleware');

// GET /api/branches (Public)
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/branches (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const branch = new Branch(req.body);
    const created = await branch.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/branches/:id (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (branch) {
      Object.assign(branch, req.body);
      const updated = await branch.save();
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
    const branch = await Branch.findById(req.params.id);
    if (branch) {
      await branch.deleteOne();
      res.json({ message: 'Branch removed' });
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
