const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@momotarou.com' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    // Create Admin
    const user = new User({
      email: 'admin@momotarou.com',
      password: 'password123',
      role: 'admin'
    });

    await user.save();
    console.log('Admin user created');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
