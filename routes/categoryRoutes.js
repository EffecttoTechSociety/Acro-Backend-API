const { Router } = require("express");
const { authenticateUser } = require("../middlewares/auth");
const { addCategories } = require("../controllers/categoryController");

const categoryRouter = Router();

// Define routes for category management

categoryRouter.post("/addcategory", authenticateUser, addCategories);

module.exports = categoryRouter;
