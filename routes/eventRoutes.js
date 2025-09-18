const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require("../controllers/eventController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { eventValidation, eventIdParamValidation } = require("../validators/eventValidator");
const { validationResult } = require("express-validator");
const APIResponse = require("../utils/apiResponse");

const router = express.Router();

router.use(authMiddleware);

// GET all events
router.get("/events", getEvents);

// CREATE event
router.post("/events", eventValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return APIResponse.getValidationError(res, errors.array());
  createEvent(req, res, next);
});

// UPDATE event
router.put("/events/:id", [...eventIdParamValidation, ...eventValidation], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return APIResponse.getValidationError(res, errors.array());
  updateEvent(req, res, next);
});

// DELETE event
router.delete("/events/:id", eventIdParamValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return APIResponse.getValidationError(res, errors.array());
  deleteEvent(req, res, next);
});

// REGISTER for event
router.post("/events/:id/register", eventIdParamValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return APIResponse.getValidationError(res, errors.array());
  registerForEvent(req, res, next);
});

module.exports = router;
