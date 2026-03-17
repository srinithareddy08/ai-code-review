let history = [];

exports.analyzeCode = (req, res) => {

  const code = req.body.code;

  let issues = [];
  let suggestions = [];

  if (code.includes("var ")) {
    issues.push("Avoid using 'var'.");
    suggestions.push("Use 'let' or 'const' instead.");
  }

  if (code.includes("console.log")) {
    issues.push("Remove console.log statements.");
    suggestions.push("Avoid console logs in production.");
  }

  if (!code.trim().endsWith(";")) {
    issues.push("Missing semicolon.");
    suggestions.push("Add semicolon at the end.");
  }

  if (issues.length === 0) {
    issues.push("No major issues detected.");
    suggestions.push("Code looks clean.");
  }

  const result = { code, issues, suggestions };

  history.push(result);

  res.json(result);
};

exports.getResults = (req, res) => {
  res.json(history);
};