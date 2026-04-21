const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { sequelize, User } = require('./config/db');
const bcrypt = require('bcryptjs');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"]
}));


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
app.use('/api/franchise', require('./routes/franchise.routes'));

// Database Connection and Server Start
const startServer = async () => {
  try {
    // Authenticate and Sync Sequelize
    await sequelize.authenticate();
    console.log('MySQL Database Connected via Sequelize');

    // Sync models
    await sequelize.sync({ alter: true }); // Enable alter: true to update existing tables with new fields
    console.log('Database synced');

    // Auto-seed Admin
    const adminEmail = 'admin@momotarounepal.com';
    const adminPassword = 'MomotarouNepal@2026!';
    
    let adminUser = await User.findOne({ where: { email: adminEmail } });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      // Synchronize password to ensure it matches the desired one
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await adminUser.update({ password: hashedPassword });
      console.log(`Admin user password synchronized for: ${adminEmail}`);
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
