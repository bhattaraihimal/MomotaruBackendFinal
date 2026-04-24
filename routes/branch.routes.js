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

// GET /api/branches/slug/:slug (Public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const branch = await Branch.findOne({
      where: { slug: req.params.slug }
    });
    
    if (branch) {
      res.json(branch);
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/branches/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);
    if (branch) {
      res.json(branch);
    } else {
      res.status(404).json({ message: 'Branch not found' });
    }
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
    const branch = await Branch.findByPk(req.params.id);
    
    if (branch) {
      await branch.update(req.body);
      res.json(branch);
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
