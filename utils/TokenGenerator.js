const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET, // Keep this secret in .env
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

module.exports = generateToken;
