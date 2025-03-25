const { Product, Cart } = require("../models");

// ✅ Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Get user ID from authentication middleware

    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if product is already in cart
    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      // Update quantity if product exists
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Add new product to cart
      cartItem = await Cart.create({ userId, productId, quantity });
    }

    res.status(200).json({ message: "Product added to cart", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get all cart items for a user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "tax"], // tax is percentage
        },
      ],
    });

    if (!cartItems.length) {
      return res.status(200).json({ message: "Cart is empty", total: 0 });
    }

    let subtotal = 0;
    let totalTax = 0;

    const cartData = cartItems.map((item) => {
      const productPrice = parseFloat(item.Product.price);
      const taxPercentage = parseFloat(item.Product.tax); // Tax in percentage
      const quantity = item.quantity;

      const itemTotal = productPrice * quantity;
      const itemTax = productPrice * (taxPercentage / 100) * quantity; // Tax amount

      subtotal += itemTotal;
      totalTax += itemTax;

      return {
        id: item.id,
        productId: item.Product.id,
        name: item.Product.name,
        price: productPrice,
        taxPercentage, // Show tax as percentage
        quantity,
        itemTotal, // Price without tax
        itemTax, // Tax amount separately
        totalWithTax: itemTotal + itemTax, // Price with tax included
      };
    });

    const grandTotal = Math.round(subtotal + totalTax);

    res.status(200).json({
      cartItems: cartData,
      subtotal,
      totalTax,
      grandTotal,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Update cart item quantity
exports.updateCart = async (req, res) => {
  try {
    const { cartId, quantity } = req.body;
    const userId = req.user.id;

    let cartItem = await Cart.findOne({ where: { id: cartId, userId } });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart updated successfully", cartItem });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.body;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({ where: { id: cartId, userId } });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await cartItem.destroy();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Clear entire cart for a user
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.destroy({ where: { userId } });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
