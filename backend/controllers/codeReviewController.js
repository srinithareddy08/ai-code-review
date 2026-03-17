exports.analyzeCode = (req, res) => {
  const { code } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({
      error: "Code cannot be empty"
    });
  }

  const result = {
    issues: ["No major issues found"],
    suggestions: ["Use better variable names"]
  };

  res.status(200).json(result);
};