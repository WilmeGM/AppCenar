const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContexts"); 

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true, 
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true, 
  },
  status: {
    type: Sequelize.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
  
});

module.exports = Product;
