const request = require("supertest");
const app = require("../app");
const { users } = require("../store");

describe("Auth API", () => {
  beforeEach(() => {
    users.length = 0;
  });

  it("registers a user", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ email: "test@test.com", password: "123456", role: "organizer" });
    expect(res.statusCode).toBe(201);
  });

  it("logs in a user", async () => {
    await request(app)
      .post("/api/register")
      .send({ email: "test@test.com", password: "123456", role: "organizer" });
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@test.com", password: "123456" });
    expect(res.body).toHaveProperty("token");
  });
});
