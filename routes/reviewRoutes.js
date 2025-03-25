const { Router } = require("express");
const { addReview } = require("../controllers/reviewController");
const { authenticateUser } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const reviewRouter = Router();

// Define routes for review management

reviewRouter.post(
  "/addreview",
  authenticateUser,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  addReview
);

module.exports = reviewRouter;
