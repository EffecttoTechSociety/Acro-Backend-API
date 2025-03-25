const { Router } = require("express");
const cartRouter = Router();

const { authenticateUser } = require("../middlewares/auth");
const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

cartRouter.post("/addtocart", authenticateUser, addToCart);
cartRouter.get("/getcart", authenticateUser, getCart);
cartRouter.patch("/updatecart", authenticateUser, updateCart);
cartRouter.delete("/removefrom", authenticateUser, removeFromCart);
cartRouter.delete("/clearcart", authenticateUser, clearCart);

module.exports = cartRouter;
