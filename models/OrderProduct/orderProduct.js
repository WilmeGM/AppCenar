const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContexts");

const OrderProduct = sequelize.define("order_product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  orderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "orders", 
    }
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "products",
    },
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1, 
  },
  unitPrice: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false, 
  },
  subtotal: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false, 
  },
});

module.exports = OrderProduct;
