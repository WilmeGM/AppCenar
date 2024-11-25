const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContexts");

const Delivery = sequelize.define('delivery', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  profilePicture: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM('available', 'busy'),
    allowNull: false,
    defaultValue: 'available',
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  resetToken: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  resetTokenExpiration: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

module.exports = Delivery;
