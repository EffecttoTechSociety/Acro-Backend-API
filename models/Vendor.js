const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User"); // Import User model

const Vendor = sequelize.define(
  "Vendor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    long: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    profile_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Adds `created_at` and `updated_at`
    paranoid: true, // Enables soft delete (`deleted_at`)
  }
);

// Define One-to-One Relationship with User
User.hasOne(Vendor, { foreignKey: "user_id" });
Vendor.belongsTo(User, { foreignKey: "user_id" });

module.exports = Vendor;
