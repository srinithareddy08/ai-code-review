const express = require("express");
const router = express.Router();

const analysisController = require("../controllers/analysiscontroller");

// 🔹 Analyze code
router.post("/", analysisController.analyzeCode);

// 🔹 Get history
router.get("/history/:userId", analysisController.getHistory);

// 🔥 NEW — Download report
router.get("/report/:id", analysisController.downloadReport);

module.exports = router;