const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    country_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    long: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Adds `created_at` and `updated_at`
    paranoid: true, // Enables soft delete (`deleted_at`)
  }
);

module.exports = User;
