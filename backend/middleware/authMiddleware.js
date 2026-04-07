const jwt = require("jsonwebtoken");

// ✅ Protects routes — verifies JWT token from Authorization header
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check token exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized — no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token using JWT_SECRET from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request so controllers can use it
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized — invalid or expired token" });
  }
};

module.exports = protect;
