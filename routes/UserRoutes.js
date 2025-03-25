const { Router } = require("express");
const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getDeletedUsers,
  getDeletedUserById,
  restoreUser,
  restoreBulkUser,
  deleteBulkUsers,
} = require("../controllers/UserController");
const { authenticateUser } = require("../middlewares/auth");

const userRouter = Router();

// Get Users
userRouter.get("/allusers", authenticateUser, getAllUsers);
userRouter.get("/user/:userId", authenticateUser, getUserById);

// Get Deleted Users
userRouter.get("/alldeletedusers", authenticateUser, getDeletedUsers);
userRouter.get("/deleteduser/:userId", authenticateUser, getDeletedUserById);

// Restore Users
userRouter.post("/restoreuser/:userId", authenticateUser, restoreUser);
userRouter.post("/restorebulkusers", authenticateUser, restoreBulkUser);

// CREATE USER
userRouter.post("/create", createUser);

// LOGIN USER
userRouter.post("/login", loginUser);

// UPDATE USER
userRouter.patch("/update/:userId", authenticateUser, updateUser);

// DELETE USER
userRouter.delete("/delete/:userId", authenticateUser, deleteUser);
userRouter.delete("/deletebulkusers", authenticateUser, deleteBulkUsers);

module.exports = userRouter;
