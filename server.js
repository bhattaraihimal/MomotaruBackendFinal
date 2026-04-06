const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/prisma');
const bcrypt = require('bcryptjs');

dotenv.config();

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
app.use('/api/menu', require('./routes/menu.routes'));
app.use('/api/branches', require('./routes/branch.routes'));
app.use('/api/testimonials', require('./routes/testimonial.routes'));
app.use('/api/gallery', require('./routes/gallery.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/team', require('./routes/team.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

// Database Connection and Server Start
const startServer = async () => {
  try {
    // Test Prisma Connection
    await prisma.$connect();
    console.log('SQL Database Connected via Prisma');

    // Auto-seed Admin
    const adminEmail = 'admin@momotarou.com';
    const adminExists = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        }
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
