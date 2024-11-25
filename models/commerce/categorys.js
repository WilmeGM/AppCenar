const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContexts"); 

const Category = sequelize.define("category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity:{
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0, 
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true, 
  },
});

module.exports = Category;
