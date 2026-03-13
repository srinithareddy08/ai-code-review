const express = require("express");
const router = express.Router();

router.post("/upload", (req, res) => {

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "No code provided" });
  }

  res.json({
    message: "Code received successfully",
    code: code
  });

});

module.exports = router;