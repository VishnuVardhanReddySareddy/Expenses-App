const { DataTypes } = require("sequelize");

const sequelize = require("../config/db-config");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ispremiumuser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  totalExpense: { type: DataTypes.FLOAT, defaultValue: 0 },
});

module.exports = User;
