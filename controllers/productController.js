const { Category, Product } = require("../models");

// Add Product Function
exports.addProduct = async (req, res) => {
  try {
    const sellerId = req.user?.id; // Extract from authentication middleware
    if (!sellerId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not logged in" });
    }

    const {
      name,
      description,
      price,
      discount,
      stock,
      tax,
      sizes,
      colors,
      customization_available,
      shipping_policy,
      return_policy,
      refund_policy,
      faq,
      categoryId,
    } = req.body;

    // Convert string values to JSON if they are strings
    const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    const parsedColors =
      typeof colors === "string" ? JSON.parse(colors) : colors;
    const parsedFaq = typeof faq === "string" ? JSON.parse(faq) : faq;

    // Validate Category
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

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

    // Create Product
    const product = await Product.create({
      name,
      description,
      price,
      discount: discount || 0,
      stock,
      tax,
      images: parsedImages,
      videos: parsedVideos,
      sizes: parsedSizes,
      colors: parsedColors,
      is_active: true,
      customization_available: customization_available === "true",
      shipping_policy,
      return_policy,
      refund_policy,
      faq: parsedFaq,
      categoryId,
      sellerId,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId, ...updates } = req.body; // Extract productId and other updates

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle image uploads (if new images are uploaded)
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
      updates.images = imageUrls; // Replace images with new uploaded ones
    }

    await product.update(updates); // Apply updates

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: Category, // Assuming a product belongs to a category
          as: "category",
        },
        {
          model: User, // Assuming a product has a seller or owner
          as: "seller",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (category) whereClause.categoryId = category;

    const products = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]],
      include: [{ model: Category, as: "category" }],
    });

    res.status(200).json({
      total: products.count,
      page: parseInt(page),
      pages: Math.ceil(products.count / limit),
      data: products.rows,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
