const { body } = require("express-validator");

// Registration validation
const registerValidation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["organizer", "attendee"])
    .withMessage("Role must be either 'organizer' or 'attendee'"),
];

// Login validation
const loginValidation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = { registerValidation, loginValidation };
