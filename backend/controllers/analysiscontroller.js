const Analysis = require("../models/analysis");
const PDFDocument = require("pdfkit");

// 🔹 Analyze code + Advanced Bug Detection (Enhanced)
exports.analyzeCode = async (req, res) => {
  try {
    const { code, userId } = req.body;

    if (!code || !userId) {
      return res.status(400).json({ error: "Code and userId are required" });
    }

    let issues = [];

    // 🔴 SECURITY ISSUES (HIGH)
    if (code.includes("eval(")) {
      issues.push({
        type: "Security",
        severity: "High",
        message: "Avoid using eval() as it can lead to code injection"
      });
    }

    if (code.includes("innerHTML")) {
      issues.push({
        type: "Security",
        severity: "High",
        message: "Using innerHTML can expose XSS vulnerabilities"
      });
    }

    // 🟠 PERFORMANCE ISSUES (MEDIUM)
    if ((code.match(/for\s*\(/g) || []).length > 1) {
      issues.push({
        type: "Performance",
        severity: "Medium",
        message: "Nested loops can cause performance issues"
      });
    }

    if (code.includes("setTimeout") && code.includes("0")) {
      issues.push({
        type: "Performance",
        severity: "Medium",
        message: "Frequent setTimeout usage may affect performance"
      });
    }

    // 🟡 CODE SMELLS (LOW)
    if (code.includes("var")) {
      issues.push({
        type: "Code Smell",
        severity: "Low",
        message: "Avoid using 'var', use 'let' or 'const'"
      });
    }

    if (code.length > 300) {
      issues.push({
        type: "Code Smell",
        severity: "Low",
        message: "Code is too long, consider modularizing"
      });
    }

    // 🔵 BEST PRACTICES (LOW)
    if (code.includes("==") && !code.includes("===")) {
      issues.push({
        type: "Best Practice",
        severity: "Low",
        message: "Use strict equality '===' instead of '=='"
      });
    }

    if (code.includes("async") && !code.includes("try")) {
      issues.push({
        type: "Best Practice",
        severity: "Medium",
        message: "Use try-catch in async functions"
      });
    }

    // ✅ Default case
    if (issues.length === 0) {
      issues.push({
        type: "Good Code",
        severity: "None",
        message: "No major issues found"
      });
    }

    const result = {
      message: "Advanced analysis completed",
      issues
    };

    const savedAnalysis = await Analysis.create({
      userId,
      code,
      result
    });

    res.status(200).json(savedAnalysis);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Analysis failed" });
  }
};


// 🔹 Get analysis history + SEARCH FEATURE
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { query } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    let filter = { userId };

    if (query) {
      filter.$or = [
        { code: { $regex: query, $options: "i" } },
        { "result.issues.message": { $regex: query, $options: "i" } },
        { "result.issues.type": { $regex: query, $options: "i" } },
        { "result.issues.severity": { $regex: query, $options: "i" } }
      ];
    }

    const history = await Analysis.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};


// 🔥 Download Report (Enhanced PDF)
exports.downloadReport = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await Analysis.findById(id);

    if (!analysis) {
      return res.status(404).json({ error: "Report not found" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${id}.pdf`
    );

    doc.pipe(res);

    // 🔹 Title
    doc.fontSize(18).text("AI Code Review Report", { align: "center" });

    doc.moveDown();
    doc.fontSize(12).text(`User ID: ${analysis.userId}`);
    doc.text(`Date: ${new Date(analysis.createdAt).toLocaleString()}`);

    doc.moveDown();
    doc.text("Code:");
    doc.text(analysis.code);

    doc.moveDown();
    doc.text("Analysis Result:");

    if (analysis.result?.issues?.length > 0) {
      analysis.result.issues.forEach((issue, index) => {
        doc.text(
          `${index + 1}. [${issue.type}] (${issue.severity}) ${issue.message}`
        );
      });
    } else {
      doc.text("No issues found");
    }

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};