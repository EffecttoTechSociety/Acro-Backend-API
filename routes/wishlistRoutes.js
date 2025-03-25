const { Router } = require("express");
const { authenticateUser } = require("../middlewares/auth");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  emptyWishlist,
} = require("../controllers/wishlistController");

const wishlistRouter = Router();

wishlistRouter.post("/addtowishlist", authenticateUser, addToWishlist);
wishlistRouter.get("/allwishlist", authenticateUser, getWishlist);
wishlistRouter.post(
  "/removefromwishlist",
  authenticateUser,
  removeFromWishlist
);
wishlistRouter.delete("/emptywishlist", authenticateUser, emptyWishlist);

module.exports = wishlistRouter;
