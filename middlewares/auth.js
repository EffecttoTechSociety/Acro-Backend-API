const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Import User model
require("dotenv").config(); // Ensure you have JWT_SECRET in .env file

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from the database
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = user; // Attach user object to request
    next(); // Continue to the next middleware
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};
