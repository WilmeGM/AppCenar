const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContexts");

const CommerceType = sequelize.define("commerceTypes", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  icon: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = CommerceType;
