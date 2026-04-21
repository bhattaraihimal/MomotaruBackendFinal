const express = require('express');
const router = express.Router();
const { User } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET /api/auth/repair-admin
router.get('/repair-admin', async (req, res) => {
  const adminEmail = 'admin@momotarounepal.com';
  const adminPassword = 'MomotarouNepal@2026!';
  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const user = await User.findOne({ where: { email: adminEmail } });

    if (!user) {
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      return res.json({ message: 'Admin account created successfully' });
    } else {
      await user.update({ password: hashedPassword });
      return res.json({ message: 'Admin account password updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: { email }
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({
        id: user.id,
        email: user.email,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
