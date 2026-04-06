const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ FIX 2: Use MongoDB User model instead of in-memory array
const User = require("../models/User");

/**
 * REGISTER CONTROLLER
 */
exports.register = async (req, res) => {
  // ✅ FIX 5: async/await with try/catch for proper error handling
  try {
    const { email, password } = req.body;

    // Check duplicate user in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ FIX 1: Hash password with bcrypt before saving (never store plain text)
    const hashed = await bcrypt.hash(password, 10);

    // ✅ FIX 2: Save to MongoDB instead of in-memory array
    const newUser = new User({ email, password: hashed });
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: { email },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * LOGIN CONTROLLER
 */
exports.login = async (req, res) => {
  // ✅ FIX 5: async/await with try/catch for proper error handling
  try {
    const { email, password } = req.body;

    // Find user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ FIX 4: Use bcrypt.compare() instead of plain string comparison
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ FIX 3: Generate JWT token so frontend can authenticate future requests
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};