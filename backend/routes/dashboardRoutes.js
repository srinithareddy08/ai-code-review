const express = require("express");
const router = express.Router();

// Mock data (replace with DB later)
let analysisResults = [];

router.get("/results", (req, res) => {
  res.status(200).json({
    message: "Analysis results fetched",
    data: analysisResults
  });
});

module.exports = router;