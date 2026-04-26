const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Branch', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleMapUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hours: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    galleryDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('images');
        if (!rawValue) return [];
        if (typeof rawValue === 'string') {
          try {
            return JSON.parse(rawValue);
          } catch (e) {
            return [];
          }
        }
        return rawValue;
      },
      set(value) {
        this.setDataValue('images', typeof value === 'string' ? value : JSON.stringify(value));
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  }, {
    timestamps: true,
  });
};
