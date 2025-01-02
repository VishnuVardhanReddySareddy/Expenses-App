const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "expense-db",
  "root",
  process.env.SQL_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = sequelize;
