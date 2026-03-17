const express = require("express");
const router = express.Router();

const analysisController = require("../controllers/analysiscontroller");

router.post("/", analysisController.analyzeCode);

module.exports = router;