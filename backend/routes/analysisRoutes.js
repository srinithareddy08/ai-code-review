const express = require("express");
const router = express.Router();

router.post("/analyze", (req, res) => {
    const { code } = req.body;

    res.json({
        message: "Code analysis endpoint working",
        receivedCode: code
    });
});

module.exports = router;