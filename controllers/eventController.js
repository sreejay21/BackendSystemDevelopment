const { events, users } = require("../store");
const apiResponse = require("../utils/apiResponse");
const commonMessages = require("../utils/constants");

const createEvent = async (req, res) => {
  const { date, time, description } = req.body;

  // Since express-validator already validated, no need for manual checks
  const event = {
    id: events.length + 1,
    date,
    time,
    description,
    participants: [],
    organizerId: req.user.id,
  };

  events.push(event);
  apiResponse.successCreate(res, event);
};

// GET all events
const getEvents = async (req, res) => {
  apiResponse.successGet(res, events);
};

// UPDATE event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === parseInt(id));

  if (!event) return apiResponse.getErrorResult(commonMessages.EventNotFound, res);
  if (event.organizerId !== req.user.id) {
    return apiResponse.forbidden(res, commonMessages.NotAuthorized);
  }

  const { date, time, description } = req.body;
  if (date) event.date = date;
  if (time) event.time = time;
  if (description) event.description = description;

  res.json(event);
};

// DELETE event
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === parseInt(id));

  if (index === -1) return apiResponse.notFound(res, commonMessages.EventNotFound);
  if (events[index].organizerId !== req.user.id) {
    return apiResponse.forbidden(res, commonMessages.NotAuthorized);
  }

  events.splice(index, 1);
  apiResponse.successDelete(res, commonMessages.EventDeleted);
};

// REGISTER for event
const registerForEvent = async (req, res) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === parseInt(id));

  if (!event) return apiResponse.notFound(res, commonMessages.EventNotFound);

  const user = users.find((u) => u.id === req.user.id);
  if (!user) return apiResponse.notFound(res, commonMessages.UserNotFound);

  if (event.participants.includes(user.id)) {
    return apiResponse.badRequest(res, commonMessages.AlreadyRegistered);
  }

  event.participants.push(user.id);
  apiResponse.Ok(res, { message: commonMessages.EventCreated, event });
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
};
