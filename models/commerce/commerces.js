const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContexts"); 

const Commerce = sequelize.define("commerce", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
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
  logo: {
    type: Sequelize.STRING,
    allowNull: true, 
  },
  openingTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  closingTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
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

module.exports = Commerce;
