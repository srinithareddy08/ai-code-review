const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes      = require("./routes/authRoutes");
const uploadRoutes    = require("./routes/uploadRoutes");
const analysisRoutes  = require("./routes/analysisRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const testRoutes      = require("./routes/testRoutes");

const app = express();

// ✅ Allow ALL origins during development (Express 5 compatible)
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("AI Code Review Backend Running");
});

// Routes
app.use("/api/auth",      authRoutes);
app.use("/api/upload",    uploadRoutes);
app.use("/api/analyze",   analysisRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/test",      testRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// PORT from .env
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = server;