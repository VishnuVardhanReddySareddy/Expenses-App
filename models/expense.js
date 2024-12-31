const { DataTypes } = require("sequelize");

const sequelize = require("../config/db-config");

const Expense = sequelize.define("Expense", {
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Expense;
