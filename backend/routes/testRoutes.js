const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.post("/run", testController.runTestCases);

module.exports = router;