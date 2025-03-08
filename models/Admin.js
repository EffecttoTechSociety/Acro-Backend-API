const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remember_me: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true, // Adds `created_at` and `updated_at`
    paranoid: true, // Enables soft delete (`deleted_at`)
  }
);

module.exports = Admin;
