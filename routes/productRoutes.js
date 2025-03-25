const { Router } = require("express");
const {
  getProduct,
  addProduct,
  updateProduct,
  getAllProducts,
} = require("../controllers/productController");
const upload = require("../middlewares/upload");
const { authenticateUser } = require("../middlewares/auth");

const productRouter = Router();

// Define routes for product management

productRouter.get("/allproducts", getAllProducts);
productRouter.get("/product/:id", getProduct);

// Route to Add Product with Image & Video Uploads
productRouter.post(
  "/addproduct",
  authenticateUser,
  upload.fields([
    { name: "images", maxCount: 5 }, // Allows uploading up to 5 images
    { name: "videos", maxCount: 2 }, // Allows uploading up to 2 videos
  ]),
  addProduct
);

productRouter.patch(
  "/updateproduct",
  authenticateUser,
  upload.array("images", 5),
  updateProduct
);

module.exports = productRouter;
