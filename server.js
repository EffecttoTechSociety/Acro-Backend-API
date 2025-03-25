// Import required modules
const express = require("express");
const mysql = require("mysql2");
const userRouter = require("./routes/UserRoutes");
const sequelize = require("./config/db");
const cors = require("cors");
const roleRouter = require("./routes/RoleRoutes");
const authRouter = require("./routes/authRoutes");
require("dotenv").config();
const path = require("path");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const orderRouter = require("./routes/orderRoutes");
const cartRouter = require("./routes/cartRoutes");
// Create an Express app
const app = express();
const port = process.env.PORT || 3102;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/users/roles", roleRouter);
app.use("/api/products", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);

sequelize.sync().then(() => {
  console.log("✅ Database synced successfully");
});

app.get("/", (req, res) => {
  res.send("Welcome to ACRO Selector API");
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on ${port}`);
});
