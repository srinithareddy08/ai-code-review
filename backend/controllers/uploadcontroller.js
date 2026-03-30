const fs = require("fs");
const Analysis = require("../models/analysis");

exports.uploadCode = async (req, res) => {
  try {
    // ❌ No file
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    const allowedTypes = [".js", ".py", ".java"];
    const fileName = req.file.originalname;

    const isValid = allowedTypes.some(type =>
      fileName.toLowerCase().endsWith(type)
    );

    // ❌ Invalid file type
    if (!isValid) {
      return res.status(400).json({
        error: "Invalid file type"
      });
    }

    // 🔹 Read file content
    const filePath = req.file.path;
    const code = fs.readFileSync(filePath, "utf-8");

    const userId = "123"; // you can make dynamic later

    // 🔥 BASIC + ADVANCED ANALYSIS (reuse logic)
    let issues = [];

    // Code Smell
    if (code.includes("var")) {
      issues.push({
        type: "Code Smell",
        severity: "Low",
        message: "Avoid using 'var'",
        suggestion: "Use let or const instead"
      });
    }

    // Security
    if (code.includes("eval(")) {
      issues.push({
        type: "Security",
        severity: "High",
        message: "Avoid using eval()",
        suggestion: "Use safer alternatives"
      });
    }

    // Best Practice
    if (code.includes("==") && !code.includes("===")) {
      issues.push({
        type: "Best Practice",
        severity: "Low",
        message: "Use === instead of ==",
        suggestion: "Use strict equality"
      });
    }

    // Default
    if (issues.length === 0) {
      issues.push({
        type: "Good Code",
        severity: "None",
        message: "No major issues found"
      });
    }

    const result = {
      message: "Analysis completed from uploaded file",
      issues
    };

    // 🔹 Save to DB
    const savedAnalysis = await Analysis.create({
      userId,
      code,
      result
    });

    // ✅ Final response
    res.json({
      message: "File uploaded and analyzed successfully",
      file: req.file.filename,
      analysis: savedAnalysis
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Upload and analysis failed"
    });
  }
};