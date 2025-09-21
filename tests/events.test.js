const request = require("supertest");
const app = require("../app");
const { users, events } = require("../store");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("Events API", () => {
  let token;

  beforeEach(async () => {
    // Reset in-memory arrays
    users.length = 0;
    events.length = 0;

    // Create and login a test organizer
    const passwordHash = await bcrypt.hash("123456", 10);
    const user = { id: 1, email: "organizer@test.com", passwordHash, role: "organizer" };
    users.push(user);

    token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  describe("Create Event", () => {
    it("should create an event successfully", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${token}`)
        .send({ date: "2025-09-21", time: "10:00", description: "Test Event" });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe(true);
      expect(res.body.result).toHaveProperty("id");
      expect(res.body.result.description).toBe("Test Event");
      expect(res.body.result.organizerId).toBe(1);
    });

    it("should fail if not authenticated", async () => {
      const res = await request(app)
        .post("/api/events")
        .send({ date: "2025-09-21", time: "10:00", description: "Test Event" });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("Get Events", () => {
    it("should return all events", async () => {
      // Prepopulate an event
      events.push({ id: 1, date: "2025-09-21", time: "10:00", description: "Event 1", participants: [], organizerId: 1 });

      const res = await request(app)
        .get("/api/events")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.result).toHaveLength(1);
    });
  });

  describe("Update Event", () => {
    it("should update event if authorized", async () => {
      events.push({ id: 1, date: "2025-09-21", time: "10:00", description: "Old Event", participants: [], organizerId: 1 });
      
      const res = await request(app)
        .put("/api/events/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Updated Event" , date: "2025-09-22", time: "11:00"});

      expect(res.statusCode).toBe(200);
    });

    it("should return forbidden if not organizer", async () => {
      events.push({ id: 1, date: "2025-09-21", time: "10:00", description: "Old Event", participants: [], organizerId: 2 });

      const res = await request(app)
        .put("/api/events/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ description: "Updated Event", date: "2025-09-22", time: "11:00" });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("Delete Event", () => {
    it("should delete event if authorized", async () => {
      events.push({ id: 1, date: "2025-09-21", time: "10:00", description: "Event", participants: [], organizerId: 1 });

      const res = await request(app)
        .delete("/api/events/1")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
    });
  });

  describe("Register for Event", () => {
    it("should register user for an event", async () => {
      events.push({ id: 1, date: "2025-09-21", time: "10:00", description: "Event", participants: [], organizerId: 1 });

      const res = await request(app)
        .post("/api/events/1/register")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.result.event.participants).toContain(1);
    });

    it("should return error if already registered", async () => {
      events.push({ id: 1, date: "2025-09-21", time: "10:00", description: "Event", participants: [1], organizerId: 1 });

      const res = await request(app)
        .post("/api/events/1/register")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
    });
  });
});
