const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User"); // Import User model to establish relationships

const Consumer = sequelize.define(
  "Consumer",
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
        model: User, // Reference to Users table
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
    timestamps: true, // Automatically adds `created_at` and `updated_at`
    paranoid: true, // Enables soft delete (adds `deleted_at`)
  }
);

// Define relationship
Consumer.belongsTo(User, { foreignKey: "user_id" });
User.hasOne(Consumer, { foreignKey: "user_id" });

module.exports = Consumer;
