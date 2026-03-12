const express = require("express");
const connectDB = require("./config/db");

// Import routes
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

// Connect database
connectDB();

// Middleware
app.use(express.json());

// Use routes
app.use("/api", analysisRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AI Code Review Assistant Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});