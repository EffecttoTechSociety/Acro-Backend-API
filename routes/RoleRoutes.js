const { Router } = require("express");
const {
  setPrimaryRole,
  deleteRole,
  addRoles,
} = require("../controllers/roleController");
const { authenticateUser } = require("../middlewares/auth");

const roleRouter = Router();

// Define routes for role management
roleRouter.post("/setprimary", authenticateUser, setPrimaryRole);
roleRouter.post("/addroles", authenticateUser, addRoles);
roleRouter.delete("/deleterole", authenticateUser, deleteRole);

module.exports = roleRouter;
 