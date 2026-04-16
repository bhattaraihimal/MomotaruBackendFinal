const dotenv = require('dotenv');
dotenv.config();
const { User, sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Database Connected');

    const adminEmail = 'admin@momotarounepal.com';
    const adminExists = await User.findOne({ where: { email: adminEmail } });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('MomotarouNepal@2026!', 10);
    await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();
