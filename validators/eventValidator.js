const { body, param } = require("express-validator");

const eventValidation = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in YYYY-MM-DD format"),
  body("time")
    .notEmpty()
    .withMessage("Time is required")
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Time must be in HH:MM (24h) format"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description too long"),
];

const eventIdParamValidation = [
  param("id")
    .notEmpty()
    .withMessage("Event ID is required")
    .isInt({ min: 1 })
    .withMessage("Event ID must be a positive integer"),
];

module.exports = { eventValidation, eventIdParamValidation };
