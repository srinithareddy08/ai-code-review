const express = require("express");
const multer = require("multer");

const router = express.Router();
const uploadController = require("../controllers/uploadcontroller");

// 🔹 Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// 🔹 File validation (TYPE)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".js", ".py", ".java"];

  const isValid = allowedTypes.some(ext =>
    file.originalname.toLowerCase().endsWith(ext)
  );

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only .js, .py, .java files are allowed"), false);
  }
};

// 🔹 Multer setup (with SIZE limit)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 // 1MB
  }
});

// 🔹 Upload route with error handling
router.post("/", (req, res) => {
  upload.single("file")(req, res, function (err) {

    // ❌ File type error
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        error: "File upload error",
        message: err.message
      });
    }

    // ❌ Custom validation error
    if (err) {
      return res.status(400).json({
        error: err.message
      });
    }

    // ❌ No file uploaded
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    // ✅ Success → call controller
    uploadController.uploadCode(req, res);
  });
});

module.exports = router;