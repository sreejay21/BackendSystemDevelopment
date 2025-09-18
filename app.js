const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", eventRoutes);

module.exports = app; // just exporting
