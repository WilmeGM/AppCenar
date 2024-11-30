const Sequelize = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("sqlite::memory:", {
    dialect: "sqlite",
    storage: path.join(
        path.dirname(require.main.filename),
        "database",
        "AppCenar.sqlite"
    ),
});

module.exports = sequelize;