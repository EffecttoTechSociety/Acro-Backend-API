const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    references: {
      model: "orders",
      key: "id",
    },
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    references: {
      model: "products",
      key: "id",
    },
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: true,
});

module.exports = OrderItem;
