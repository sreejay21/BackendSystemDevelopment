const { events, users } = require("../store");

// CREATE EVENT (organizers only)
const createEvent = async (req, res) => {
  const { date, time, description } = req.body;

  if (!date || !time || !description) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const event = {
    id: events.length + 1,
    date,
    time,
    description,
    participants: [],
    organizerId: req.user.id,
  };

  events.push(event);
  res.status(201).json(event);
};

// GET ALL EVENTS
const getEvents = async (req, res) => {
  res.json(events);
};

// UPDATE EVENT (only organizer)
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === parseInt(id));

  if (!event) return res.status(404).json({ message: "Event not found" });
  if (event.organizerId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const { date, time, description } = req.body;
  if (date) event.date = date;
  if (time) event.time = time;
  if (description) event.description = description;

  res.json(event);
};

// DELETE EVENT (only organizer)
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === parseInt(id));

  if (index === -1) return res.status(404).json({ message: "Event not found" });
  if (events[index].organizerId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  events.splice(index, 1);
  res.json({ message: "Event deleted" });
};

// REGISTER FOR EVENT (attendees)
const registerForEvent = async (req, res) => {
  const { id } = req.params;
  const event = events.find((e) => e.id === parseInt(id));

  if (!event) return res.status(404).json({ message: "Event not found" });

  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (event.participants.includes(user.id)) {
    return res.status(400).json({ message: "Already registered" });
  }

  event.participants.push(user.id);
  res.json({ message: "Registered successfully", event });
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
};
