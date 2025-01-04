const { DataTypes } = require("sequelize");
const sequelize = require("../config/db-config");
const User = require("./user");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isactive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Define associations


module.exports = ForgotPasswordRequest;
