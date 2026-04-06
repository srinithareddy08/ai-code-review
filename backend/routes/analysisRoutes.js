const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysiscontroller");
const protect = require("../middleware/authMiddleware");
const body = require("express-validator");

// 🔹 Analyze code
router.post("/", protect, analysisController.analyzeCode);

// 🔹 Get history
router.get("/history/:userId", protect, analysisController.getHistory);

// 🔥 NEW — Download report
router.get("/report/:id", protect, analysisController.downloadReport);

module.exports = router;