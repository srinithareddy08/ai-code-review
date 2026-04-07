const Analysis    = require("../models/analysis");
const PDFDocument = require("pdfkit");

// ✅ Smart keyword-based analysis (works without API key)
function analyzeCodeLocally(code) {
  const issues = [];

  if (code.includes("eval("))
    issues.push({ type:"Security", severity:"High",
      message:"eval() executes arbitrary code — serious security risk",
      suggestion:"Remove eval(). Use JSON.parse() or safer alternatives" });

  if (code.includes("innerHTML"))
    issues.push({ type:"Security", severity:"High",
      message:"innerHTML can expose XSS vulnerabilities",
      suggestion:"Use textContent or sanitize input with DOMPurify" });

  if (/SELECT.*WHERE.*\+/.test(code) || /query.*\+.*id/i.test(code))
    issues.push({ type:"Security", severity:"High",
      message:"Possible SQL injection — string concatenation in query detected",
      suggestion:"Use parameterized queries or prepared statements" });

  if (code.match(/password\s*=\s*["'][^"']+["']/i))
    issues.push({ type:"Security", severity:"High",
      message:"Hardcoded password detected in source code",
      suggestion:"Move credentials to environment variables (.env file)" });

  if (code.includes("http://") && !code.includes("localhost"))
    issues.push({ type:"Security", severity:"Medium",
      message:"Insecure HTTP URL detected — use HTTPS instead",
      suggestion:"Replace http:// with https:// for all external requests" });

  if (code.includes("async") && !code.includes("try"))
    issues.push({ type:"Bug Risk", severity:"Medium",
      message:"Async function missing try-catch — unhandled promise rejections",
      suggestion:"Wrap async code in try { } catch(err) { } blocks" });

  if (code.includes("== null") || code.includes("== undefined"))
    issues.push({ type:"Bug Risk", severity:"Medium",
      message:"Loose null/undefined check can cause unexpected behaviour",
      suggestion:"Use === null or === undefined for strict checks" });

  const forLoops = (code.match(/for\s*\(/g) || []).length;
  if (forLoops > 2)
    issues.push({ type:"Performance", severity:"Medium",
      message:`${forLoops} loops detected — possible nested loop performance issue`,
      suggestion:"Consider using map/filter/reduce or optimise with hashmap" });

  if (code.includes("setInterval") && !code.includes("clearInterval"))
    issues.push({ type:"Performance", severity:"Medium",
      message:"setInterval used without clearInterval — memory leak risk",
      suggestion:"Always store the interval ID and call clearInterval() when done" });

  if (code.includes("var "))
    issues.push({ type:"Code Style", severity:"Low",
      message:"'var' is outdated — use 'let' or 'const' instead",
      suggestion:"Replace var with const for constants, let for variables" });

  if (code.includes("==") && !code.includes("===") && !code.includes("!=="))
    issues.push({ type:"Code Style", severity:"Low",
      message:"Loose equality '==' used — prefer strict equality '==='",
      suggestion:"Replace == with === and != with !== for safer comparisons" });

  if (code.includes("console.log"))
    issues.push({ type:"Code Style", severity:"Low",
      message:"console.log() statements found — remove before production",
      suggestion:"Remove debug logs or use a proper logging library" });

  if (!code.includes("//") && !code.includes("/*") && code.length > 100)
    issues.push({ type:"Best Practice", severity:"Low",
      message:"No comments found in code — hard to understand for others",
      suggestion:"Add comments explaining what functions and logic do" });

  if (code.length > 500)
    issues.push({ type:"Best Practice", severity:"Low",
      message:"Code is long — consider breaking into smaller functions",
      suggestion:"Split into smaller reusable functions for better readability" });

  if (issues.length === 0)
    issues.push({ type:"Good Code", severity:"None",
      message:"No issues detected — code looks clean!",
      suggestion:"Keep following best practices" });

  return issues;
}

// ✅ Main analyze endpoint
exports.analyzeCode = async (req, res) => {
  try {
    const { code, userId } = req.body;
    if (!code)   return res.status(400).json({ error: "Code is required" });
    if (!userId) return res.status(400).json({ error: "userId is required" });

    let issues = [];

    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const Anthropic = require("@anthropic-ai/sdk");
        const client    = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const message   = await client.messages.create({
          model: "claude-opus-4-6", max_tokens: 1024,
          messages: [{ role: "user", content: `You are an expert code reviewer. Analyze this code and return ONLY valid JSON with no markdown:
{"issues":[{"type":"Security|Performance|Code Style|Best Practice|Bug Risk|Good Code","severity":"High|Medium|Low|None","message":"description","suggestion":"how to fix"}]}
Code:\n\`\`\`\n${code.substring(0,3000)}\n\`\`\`` }]
        });
        const raw    = message.content[0].text;
        const clean  = raw.replace(/```json|```/g, "").trim();
        issues       = JSON.parse(clean).issues || [];
      } catch (aiError) {
        issues = analyzeCodeLocally(code);
      }
    } else {
      issues = analyzeCodeLocally(code);
    }

    const result        = { message: "Analysis completed", issues };
    const savedAnalysis = await Analysis.create({ userId, code, result });
    res.status(200).json(savedAnalysis);

  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Analysis failed: " + error.message });
  }
};

// ✅ Get history
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID is required" });
    const history = await Analysis.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// ✅ Download PDF Report — forces download directly to Downloads folder
exports.downloadReport = async (req, res) => {
  try {
    const { id }   = req.params;
    const analysis = await Analysis.findById(id);
    if (!analysis) return res.status(404).json({ error: "Report not found" });

    const doc      = new PDFDocument({ margin: 50 });
    const filename = `CodeReview-Report-${id}.pdf`;

    // ✅ These headers force the browser to DOWNLOAD the file
    // instead of opening it in the browser
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");

    doc.pipe(res);

    // ── Header ──────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 70).fill("#0d1424");
    doc.fill("#ffffff").fontSize(20)
       .text("AI Code Review Report", 50, 22, { align: "center" });

    doc.fill("#000000").moveDown(3);

    // ── Meta info ────────────────────────────────────
    doc.fontSize(11).fillColor("#444444");
    doc.text(`User:         ${analysis.userId}`);
    doc.text(`Date:         ${new Date(analysis.createdAt).toLocaleString()}`);

    const issues     = analysis.result?.issues || [];
    const realIssues = issues.filter(i => (i.severity||"").toLowerCase() !== "none");
    const high       = realIssues.filter(i => (i.severity||"").toLowerCase() === "high").length;
    const medium     = realIssues.filter(i => (i.severity||"").toLowerCase() === "medium").length;
    const low        = realIssues.filter(i => (i.severity||"").toLowerCase() === "low").length;
    const score      = Math.max(0, 100 - (high*20) - (medium*8) - (low*3));

    doc.text(`Total Issues: ${realIssues.length}`);
    doc.text(`Score:        ${score}/100`);

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke("#cccccc");
    doc.moveDown();

    // ── Code section ─────────────────────────────────
    doc.fontSize(13).fillColor("#000000").text("Submitted Code:", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor("#333333").font("Courier")
       .text(analysis.code.substring(0, 800), { lineGap: 3 });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke("#cccccc");
    doc.moveDown();

    // ── Issues section ───────────────────────────────
    doc.font("Helvetica").fontSize(13).fillColor("#000000")
       .text("Issues Found:", { underline: true });
    doc.moveDown(0.5);

    if (realIssues.length > 0) {
      realIssues.forEach((issue, i) => {
        const color = issue.severity === "High"   ? "#ef4444"
                    : issue.severity === "Medium" ? "#f59e0b"
                    : "#10b981";

        doc.fontSize(11).fillColor(color)
           .text(`${i+1}. [${issue.severity}] ${issue.type}`);
        doc.fontSize(10).fillColor("#000000")
           .text(`   ${issue.message}`);
        if (issue.suggestion)
          doc.fontSize(9).fillColor("#555555")
             .text(`   Fix: ${issue.suggestion}`);
        doc.moveDown(0.4);
      });
    } else {
      doc.fontSize(11).fillColor("#10b981")
         .text("✅ No issues found — excellent code!");
    }

    // ── Footer ───────────────────────────────────────
    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(560, doc.y).stroke("#cccccc");
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor("#888888")
       .text("Generated by AI Code Review Assistant — Ontario Tech University",
             { align: "center" });

    doc.end();

  } catch (error) {
    console.error("Report error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};