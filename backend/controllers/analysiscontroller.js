exports.analyzeCode = (req, res) => {

  const code = req.body.code;

  let issues = [];

  if (code.includes("var ")) {
    issues.push("Avoid using 'var'. Use 'let' or 'const'.");
  }

  if (code.includes("console.log")) {
    issues.push("Remove console.log statements in production.");
  }

  if (issues.length === 0) {
    issues.push("No major issues detected.");
  }

  res.json({
    analysis: issues
  });
};