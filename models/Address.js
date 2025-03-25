const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    full_name: {
      type: DataTypes.STRING,
    },
    contact: {
      type: DataTypes.STRING(20),
    },
    alt_contact: {
      type: DataTypes.STRING(20),
    },
    add_line1: {
      type: DataTypes.STRING,
    },
    add_line2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pin_code: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    country_code: {
      type: DataTypes.STRING(10),
    },

    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Automatically adds `created_at` and `updated_at`
    paranoid: true, // Enables soft delete (`deleted_at`)
  }
);

// Define relationships

module.exports = Address;
