const { Router } = require("express");
const {
  createOrder,
  getUserOrders,
  getOrderById,
} = require("../controllers/orderController");
const { authenticateUser } = require("../middlewares/auth");

const orderRouter = Router();

orderRouter.post("/createorder", authenticateUser, createOrder);
orderRouter.get("/getorders", authenticateUser, getUserOrders);
orderRouter.get("/getorderbyid/:orderId", authenticateUser, getOrderById);

module.exports = orderRouter;
