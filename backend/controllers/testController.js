exports.runTestCases = async (req, res) => {
  try {
    const { code, testCases } = req.body;

    if (!code || !testCases) {
      return res.status(400).json({ error: "Code and test cases required" });
    }

    let results = [];

    testCases.forEach((test, index) => {
      try {
        // 🔹 Simulate execution
        const output = eval(code);

        const passed = output == test.expected;

        results.push({
          testCase: index + 1,
          expected: test.expected,
          output,
          status: passed ? "Pass" : "Fail"
        });

      } catch (error) {
        results.push({
          testCase: index + 1,
          status: "Error",
          message: error.message
        });
      }
    });

    res.json(results);

  } catch (error) {
    res.status(500).json({ error: "Test execution failed" });
  }
};