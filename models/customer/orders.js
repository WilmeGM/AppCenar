const Sequelize = require("sequelize");
const Delivery = require("../../models/delivery/delivery");
const sequelize = require("../../contexts/appContexts");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  subtotal: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  itbis: {
    type: Sequelize.DECIMAL(5, 2),
    allowNull: false,
  },
  total: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  deliveryId: {
    type: Sequelize.INTEGER,
    references: {
      model: Delivery,
    },
  },
  status: {
    type: Sequelize.ENUM("pending", "in_process", "completed"),
    allowNull: false,
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  hour: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = Order;

