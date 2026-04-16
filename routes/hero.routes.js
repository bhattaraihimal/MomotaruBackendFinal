const express = require('express');
const router = express.Router();
const { HeroSetting } = require('../config/db');
const { protect } = require('../middleware');

// GET /api/hero (Public)
router.get('/', async (req, res) => {
  try {
    let hero = await HeroSetting.findOne();
    if (!hero) {
      // Create a default hero setting if it doesn't exist
      hero = await HeroSetting.create({
        type: 'video',
        url: '/hero/momotarou_hero.mp4',
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
    
    let hero = await HeroSetting.findOne();
    
    if (!hero) {
      hero = await HeroSetting.create({ type, url });
    } else {
      await HeroSetting.update(
        { type, url },
        { where: { id: hero.id } }
      );
      hero = await HeroSetting.findByPk(hero.id);
    }
    
    res.json(hero);
  } catch (error) {
    console.error("Hero setting error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
