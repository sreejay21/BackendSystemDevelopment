const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require("../controllers/eventController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/events", getEvents);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);
router.post("/events/:id/register", registerForEvent);

module.exports = router;
