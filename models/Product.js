const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sellerId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER, // Percentage discount
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2), // Percentage tax
      defaultValue: 0,
    },
    images: {
      type: DataTypes.JSON, // Store multiple image URLs
      allowNull: true,
    },
    videos: {
      type: DataTypes.JSON, // Store product video URLs
      allowNull: true,
    },
    sizes: {
      type: DataTypes.JSON, // Example: ["38cm", "50cm"]
      allowNull: true,
    },
    colors: {
      type: DataTypes.JSON, // Example: ["Brown", "Black", "Cream", "Coffee"]
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    customization_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    shipping_policy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    return_policy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refund_policy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    faq: {
      type: DataTypes.JSON, // Example: [{ question: "Is it durable?", answer: "Yes, high quality." }]
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true, // Soft delete
  }
);

module.exports = Product;
