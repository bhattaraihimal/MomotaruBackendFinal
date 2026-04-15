const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware');

// GET /api/hero (Public)
router.get('/', async (req, res) => {
  try {
    let hero = await prisma.heroSetting.findFirst();
    if (!hero) {
      // Create a default hero setting if it doesn't exist
      hero = await prisma.heroSetting.create({
        data: {
          type: 'video',
          url: '/hero/momotarou_hero.mp4',
        }
      });
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/hero (Admin)
router.put('/', protect, async (req, res) => {
  try {
    const { type, url } = req.body;
    
    let hero = await prisma.heroSetting.findFirst();
    
    if (!hero) {
      hero = await prisma.heroSetting.create({
        data: { type, url }
      });
    } else {
      hero = await prisma.heroSetting.update({
        where: { id: hero.id },
        data: { type, url }
      });
    }
    
    res.json(hero);
  } catch (error) {
    console.error("Hero setting error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
