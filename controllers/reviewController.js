const { Product, Review } = require("../models");

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; // Get user from middleware

    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({
      where: { productId, userId },
    });
    if (existingReview)
      return res
        .status(400)
        .json({ error: "You have already reviewed this product" });

    // Handle file uploads
    // Handle Image Uploads (Multer stores images in req.files)
    let images = [];
    if (req.files && req.files.images) {
      images = req.files.images.map((file) => `/uploads/${file.filename}`);
    }

    // Handle Video Uploads (if applicable)
    let videos = [];
    if (req.files && req.files.videos) {
      videos = req.files.videos.map((file) => `/uploads/${file.filename}`);
    }

    const parsedImages =
      typeof images === "string" ? JSON.parse(images) : images;
    const parsedVideos =
      typeof videos === "string" ? JSON.parse(videos) : videos;

    // Create a new review
    const review = await Review.create({
      productId,
      userId,
      rating,
      comment,
      images: parsedImages,
      videos: parsedVideos,
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
