const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    
      unique: true,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Adds `created_at` and `updated_at`
    paranoid: true, // Enables soft delete (`deleted_at`)
  }
);

module.exports = Role;
