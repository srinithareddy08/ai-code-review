const express = require("express");
const router = express.Router();

const analysisController = require("../controllers/analysiscontroller");

// 🔹 Analyze code
router.post("/analyze", analysisController.analyzeCode);

// 🔹 Get history
router.get("/history/:userId", analysisController.getHistory);

module.exports = router;