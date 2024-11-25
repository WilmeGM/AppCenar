const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContexts"); 

const Favorite = sequelize.define("favorites", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Favorite;
