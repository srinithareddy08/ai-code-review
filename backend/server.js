const express = require("express");
const connectDB = require("./config/db");

// Import routes
const analysisRoutes = require("./routes/analysisRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Connect database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api", analysisRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/code", uploadRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AI Code Review Assistant Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});