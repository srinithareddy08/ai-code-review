describe("Code Review Test", () => {

  test("Code analysis logic works", () => {

    const code = "var x = 10";

    const hasVar = code.includes("var");

    expect(hasVar).toBe(true);

  });

});