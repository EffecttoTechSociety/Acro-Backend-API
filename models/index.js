const User = require("./User");
const Address = require("./Address");
const Role = require("./Role");
const Product = require("./Product");
const Review = require("./Review");
const Category = require("./Category");
const Wishlist = require("./Wishlist");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Cart = require("./Cart");

// Define relationships

// USER-ADDRESS
User.hasMany(Address, { foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

// USER-REVIEWS
User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

// USER-ROLES
User.belongsToMany(Role, { through: "UserRole" });
Role.belongsToMany(User, { through: "UserRole" });

// USER-PRODUCT
User.hasMany(Product, { foreignKey: "sellerId" });
Product.belongsTo(User, { foreignKey: "sellerId" });

// PRODUCT-REVIEWS
Product.hasMany(Review, { foreignKey: "productId" });
Review.belongsTo(Product, { foreignKey: "productId" });

//PRODUCT-CATEGORIES
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });

// USER-WISHLIST
User.hasMany(Wishlist, { foreignKey: "userId" });
Wishlist.belongsTo(User, { foreignKey: "userId" });

// PRODUCT-WISHLIST
Product.hasMany(Wishlist, { foreignKey: "productId" });
Wishlist.belongsTo(Product, { foreignKey: "productId" });

// ORDER-USER
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// ORDER-ORDERITEMS
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

//PRODUCT-ORDERITEM
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

//USER-CART
User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

//PRODUCT-CART
Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

module.exports = {
  User,
  Address,
  Review,
  Role,
  Product,
  Category,
  Wishlist,
  Order,
  OrderItem,
  Cart,
};
