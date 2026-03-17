const request = require("supertest");
const server = require("../server");

describe("Dashboard Test", () => {

  test("GET /api/dashboard/results", async () => {
    const res = await request(server).get("/api/dashboard/results");

    expect(res.statusCode).toBe(200);
  });

});

afterAll(() => {
  server.close();
});