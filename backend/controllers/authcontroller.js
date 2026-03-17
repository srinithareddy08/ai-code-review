const users = [];

/**
 * REGISTER CONTROLLER
 */
exports.register = (req, res) => {
  const { email, password } = req.body;

  // ❌ Check empty fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // ❌ Basic email format validation
  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // ❌ Password length validation
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  // ❌ Check duplicate user
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // ✅ Save user
  users.push({ email, password });

  return res.status(201).json({
    message: "User registered successfully",
    user: { email }
  });
};

/**
 * LOGIN CONTROLLER
 */
exports.login = (req, res) => {
  const { email, password } = req.body;

  // ❌ Check empty fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 🔍 Find user
  const user = users.find(u => u.email === email && u.password === password);

  // ❌ If not found
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // ✅ Success
  return res.status(200).json({
    message: "Login successful",
    user: { email }
  });
};