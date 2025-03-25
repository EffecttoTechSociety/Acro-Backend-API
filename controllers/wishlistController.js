const { Wishlist } = require("../models");

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const existingItem = await Wishlist.findOne({
      where: { userId, productId },
    });
    if (existingItem)
      return res.status(400).json({ message: "Already in wishlist" });

    const wishlistItem = await Wishlist.create({ userId, productId });
    res.status(201).json({ message: "Added to wishlist", wishlistItem });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({ where: { userId: req.user.id } });
    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    await Wishlist.destroy({ where: { userId: req.user.id, productId } });
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.emptyWishlist = async (req, res) => {
    try {
        await Wishlist.destroy({ where: { userId: req.user.id } });
        res.status(200).json({ message: "Wishlist emptied" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};