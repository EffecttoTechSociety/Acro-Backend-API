const { Category } = require("../models");

exports.addCategories = async (req, res) => {
  try {
    const { categories } = req.body; // Expecting an array of categories

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: "Categories array is required" });
    }

    // Check for duplicate categories in the database
    const existingCategories = await Category.findAll({
      where: {
        name: categories.map((cat) => cat.name),
      },
    });

    const existingCategoryNames = existingCategories.map((cat) => cat.name);

    // Filter out categories that already exist
    const newCategories = categories.filter(
      (cat) => !existingCategoryNames.includes(cat.name)
    );

    if (newCategories.length === 0) {
      return res.status(400).json({ error: "All categories already exist" });
    }

    // Bulk insert new categories
    const createdCategories = await Category.bulkCreate(newCategories);

    res.status(201).json({
      message: "Categories added successfully",
      categories: createdCategories,
    });
  } catch (error) {
    console.error("Error adding categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
