const Analysis = require("../models/analysis");
const PDFDocument = require("pdfkit");

// 🔹 Analyze code + Save to DB
exports.analyzeCode = async (req, res) => {
  try {
    const { code, userId } = req.body;

    if (!code || !userId) {
      return res.status(400).json({ error: "Code and userId are required" });
    }

    // 🔹 Basic AI logic
    const result = {
      message: "Basic analysis done",
      issues: code.includes("var")
        ? ["Avoid using 'var', use 'let' or 'const'"]
        : ["No major issues found"]
    };

    // 🔹 Save analysis
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

    // 🔥 SEARCH LOGIC
    if (query) {
      filter.$or = [
        { code: { $regex: query, $options: "i" } },
        { "result.issues": { $regex: query, $options: "i" } }
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


// 🔥 Download Report (PDF)
exports.downloadReport = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await Analysis.findById(id);

    if (!analysis) {
      return res.status(404).json({ error: "Report not found" });
    }

    const doc = new PDFDocument();

    // 🔹 Headers
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
        doc.text(`${index + 1}. ${issue}`);
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