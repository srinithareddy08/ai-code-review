const express    = require("express");
const router     = express.Router();

const analysisController = require("../controllers/analysisController");
const protect            = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");
const rateLimit  = require("express-rate-limit");

const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please slow down." },
});

const validateAnalyze = [
  body("code").notEmpty().withMessage("Code is required"),
  body("code").isLength({ max: 10000 }).withMessage("Code too long"),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 🔹 Analyze code — protected + rate limited + validated
router.post("/", protect, analyzeLimiter, validateAnalyze, handleValidation, analysisController.analyzeCode);

// 🔹 Get history — protected
router.get("/history/:userId", protect, analysisController.getHistory);

// ✅ Download report — NO auth needed (ID is unguessable, opens in browser tab)
router.get("/report/:id", analysisController.downloadReport);

module.exports = router;