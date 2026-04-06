const express = require("express");
const router = express.Router();

// ✅ FIX 3: Corrected casing to match exact filename
const authController = require("../controllers/authController");

// ✅ FIX 1: Rate limiting — max 10 requests per 15 minutes per IP
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many attempts, please try again later." },
});

// ✅ FIX 2: Input validation using express-validator
const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Middleware to return validation errors before hitting controller
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ✅ FIX 4: Removed extra blank line — routes grouped cleanly
router.post("/register", authLimiter, validateRegister, handleValidation, authController.register);
router.post("/login", authLimiter, validateLogin, handleValidation, authController.login);

module.exports = router;