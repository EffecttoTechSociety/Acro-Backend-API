const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = require("./User"); // Import User model
const Consumer = require("./consumer");

const ConsumerAddress = sequelize.define(
  "ConsumerAddress",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    consumer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Consumer, // Reference to Consumers table
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User, // Reference to Users table (nullable)
        key: "id",
      },
      onDelete: "SET NULL",
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    house_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pin_code: {
      type: DataTypes.STRING,
      allowNull: false,
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
ConsumerAddress.belongsTo(Consumer, { foreignKey: "consumer_id" });
Consumer.hasMany(ConsumerAddress, { foreignKey: "consumer_id" });

ConsumerAddress.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(ConsumerAddress, { foreignKey: "user_id" });

module.exports = ConsumerAddress;
