// Import required modules
const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

// Create an Express app
const app = express();
const port = process.env.PORT || 3100;

// Middleware
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "testdb",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database");
});

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js Express MySQL API!");
});

// Sample API route
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
