const { Order, OrderItem } = require("../models");

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // Array of { productId, quantity, price }
    const userId = req.user.id;

    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.quantity * item.price;
    });

    const order = await Order.create({ userId, totalAmount });

    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: OrderItem,
    });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrderById = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findByPk(orderId, { include: OrderItem });
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
};


