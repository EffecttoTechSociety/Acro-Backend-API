const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
    },
    last_name: {
      type: DataTypes.STRING(50),
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
    },
    email: {
      type: DataTypes.STRING,

      unique: true,

      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
    },

    contact: {
      type: DataTypes.STRING(20),
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING(10),
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
