const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const testRoutes = require("./routes/testRoutes");

const app = express();

// ✅ FIX 1: Restricted CORS — only allow your frontend origin
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("AI Code Review Backend Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analyze", analysisRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/test", testRoutes);

// ✅ FIX 2: MongoDB URI from .env (not hardcoded)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  // ✅ FIX 5: Exit process on DB connection failure
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ FIX 4: Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// ✅ FIX 3: PORT from environment variable with fallback
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;