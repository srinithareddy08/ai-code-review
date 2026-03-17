const request = require("supertest");
const server = require("../server");

describe("Server Test", () => {

  test("GET / should return 200", async () => {

    const res = await request(server).get("/");

    expect(res.statusCode).toBe(200);

  });

});
afterAll(() => {
  server.close();
});