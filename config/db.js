const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql', // Using mysql dialect for both MySQL and MariaDB
  logging: false,    // Set to console.log if you want to see SQL queries
});

// Import models
const User = require('../models/User')(sequelize);
const Branch = require('../models/Branch')(sequelize);
const Contact = require('../models/Contact')(sequelize);
const Gallery = require('../models/Gallery')(sequelize);
const Category = require('../models/Category')(sequelize);
const Menu = require('../models/Menu')(sequelize);
const Team = require('../models/Team')(sequelize);
const Testimonial = require('../models/Testimonial')(sequelize);
const HeroSetting = require('../models/HeroSetting')(sequelize);
const Timeline = require('../models/Timeline')(sequelize);
const Franchise = require('../models/Franchise')(sequelize);

// Define Associations
Category.hasMany(Menu, { foreignKey: 'categoryId', as: 'menus' });
Menu.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = {
  sequelize,
  User,
  Branch,
  Contact,
  Gallery,
  Category,
  Menu,
  Team,
  Testimonial,
  HeroSetting,
  Timeline,
  Franchise,
};
