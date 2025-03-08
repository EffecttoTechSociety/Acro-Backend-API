const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("testdb", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Connected to MySQL using Sequelize"))
  .catch((err) => console.error("Database connection failed:", err));

module.exports = sequelize;
