const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Code Review Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analyze", analysisRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = 5000;

const server = app.listen(5000, () => {
  console.log("Server running on port 5000");
});

module.exports = server;