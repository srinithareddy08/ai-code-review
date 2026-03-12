const express = require("express");
const router = express.Router();

router.get("/analyze", (req, res) => {
  res.json({
    message: "AI Code Analysis endpoint working"
  });
});

module.exports = router;