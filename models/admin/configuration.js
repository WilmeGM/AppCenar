const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContexts");

const Configuration = sequelize.define("configuration", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  itbis: {
    type: Sequelize.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 18.00, 
  },
});

module.exports = Configuration;
