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
    defaultValue: false, // Defaults to false, meaning the user is not a premium user by default
  },
});

module.exports = User;
