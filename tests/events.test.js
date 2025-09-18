const request = require("supertest");
const app = require("../app");
const { users, events } = require("../store");

let token;

describe("Events API", () => {
  beforeEach(async () => {
    users.length = 0;
    events.length = 0;
    await request(app)
      .post("/api/register")
      .send({ email: "org@test.com", password: "123456", role: "organizer" });
    const res = await request(app)
      .post("/api/login")
      .send({ email: "org@test.com", password: "123456" });
    token = res.body.token;
  });

  it("creates an event", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Event 1", date: "2025-09-20", time: "10:00", description: "Test" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Event 1");
  });
});
