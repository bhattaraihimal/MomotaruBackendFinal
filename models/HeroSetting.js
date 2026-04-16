const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('HeroSetting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'video',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    createdAt: false,
  });
};
