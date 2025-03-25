const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter for images/videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|heic|heif|gif|mp4|avi|mov/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Only images (JPEG, JPG, WEBP, HEIC, HEIF, PNG, GIF) and videos (MP4, AVI, MOV) are allowed"
      )
    );
  }
};

// Initialize Multer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter,
});

module.exports = upload;
