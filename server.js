const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { sequelize, User } = require('./config/db');
const bcrypt = require('bcryptjs');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Momotarou Restaurant API is running');
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/menu', require('./routes/menu.routes'));
app.use('/api/branches', require('./routes/branch.routes'));
app.use('/api/testimonials', require('./routes/testimonial.routes'));
app.use('/api/gallery', require('./routes/gallery.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/team', require('./routes/team.routes'));
app.use('/api/timeline', require('./routes/timeline.routes'));
app.use('/api/hero', require('./routes/hero.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

// Database Connection and Server Start
const startServer = async () => {
  try {
    // Authenticate and Sync Sequelize
    await sequelize.authenticate();
    console.log('MySQL Database Connected via Sequelize');
    
    // Sync models
    await sequelize.sync(); // or { alter: true } if you want to update existing tables
    console.log('Database synced');

    // Auto-seed Admin
    const adminEmail = 'admin@momotarou.com';
    const adminExists = await User.findOne({
      where: { email: adminEmail }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created: admin@momotarou.com / password123');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Server Startup Error:', error);
    process.exit(1);
  }
};

startServer();
