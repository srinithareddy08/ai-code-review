const Analysis = require("../models/analysis");

// 🔹 Analyze code + Save to DB
exports.analyzeCode = async (req, res) => {
  try {
    const { code, userId } = req.body;

    if (!code || !userId) {
      return res.status(400).json({ error: "Code and userId are required" });
    }

    // 🔹 Basic AI logic (you can improve later)
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


// 🔹 Get analysis history
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await Analysis.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};