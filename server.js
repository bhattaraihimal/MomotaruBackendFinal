const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

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
    let mongoUri = process.env.MONGO_URI;
    let isMemory = false;

    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB Connected (Local)');
    } catch (err) {
      console.log('Local MongoDB connection failed, starting in-memory database...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      isMemory = true;
      console.log('MongoDB Connected (In-Memory)');
    }

    // Auto-seed Admin if strictly necessary or in-memory
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: 'admin@momotarou.com' });
    if (!adminExists) {
      const user = new User({
        email: 'admin@momotarou.com',
        password: 'password123', // Will be hashed by pre-save
        role: 'admin'
      });
      await user.save();
      console.log('Admin user created: admin@momotarou.com / password123');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (isMemory) console.log('WARNING: Running with in-memory DB. Data will be lost on restart.');
    });

  } catch (error) {
    console.error('Server Startup Error:', error);
  }
};

startServer();
