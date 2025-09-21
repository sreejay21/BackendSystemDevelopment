const request = require("supertest");
const app = require("../app");
const { users } = require("../store");
const bcrypt = require("bcrypt");
const commonMessages = require("../utils/constants");

describe("Auth API", () => {
  beforeEach(() => {
    // Reset in-memory users before each test
    users.length = 0;
  });

  describe("Register User", () => {
    it("registers a new user successfully", async () => {
      const res = await request(app)
        .post("/api/register")
        .send({
          email: "test@test.com",
          password: "123456",
          role: "organizer"
        });

      expect(res.statusCode).toBe(201); // successCreate sends 201
      expect(res.body.status).toBe(true);
      expect(res.body.responsecode).toBe(201);
      expect(res.body.result).toHaveProperty("id");
      expect(res.body.result.email).toBe("test@test.com");
      expect(res.body.result.role).toBe("organizer");
    });

    it("fails registration if email already exists", async () => {
      // Add user manually
      const passwordHash = await bcrypt.hash("123456", 10);
      users.push({ id: 1, email: "test@test.com", passwordHash, role: "organizer" });

      const res = await request(app)
        .post("/api/register")
        .send({
          email: "test@test.com",
          password: "123456",
          role: "organizer"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);  
      
    });
  });

  describe("Login User", () => {
    beforeEach(async () => {
      // Add a user to login
      const passwordHash = await bcrypt.hash("123456", 10);
      users.push({ id: 1, email: "test@test.com", passwordHash, role: "organizer" });
    });

    it("logs in a valid user successfully", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "test@test.com", password: "123456" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token")
    });

    it("fails login with wrong password", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "test@test.com", password: "wrongpass" });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
    });

    it("fails login with non-existent email", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "nouser@test.com", password: "123456" });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
    });
  });
});
