const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../store");
const { sendMail } = require("../mailer");
const { validationResult } = require("express-validator");
const APIResponse = require("../utils/apiResponse");
const commonMessages = require("../utils/constants");
// REGISTER
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return APIResponse.getValidationError(res, errors.array());
  }

  const { email, password, role } = req.body;

  const existing = users.find((u) => u.email === email);
  if (existing) {
   return APIResponse.badRequest(res, commonMessages.EmailAlreadyExists);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, passwordHash, role };
  users.push(user);

  // Send welcome email
  try {
    await sendMail(email, commonMessages.WelcomeMailSubject);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

   APIResponse.successCreate(res, { id: user.id, email: user.email, role: user.role });
};

// LOGIN
const loginUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return APIResponse.getValidationError(res, errors.array());
  }

  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return APIResponse.badRequest(res, commonMessages.InvalidCredentials);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return APIResponse.badRequest(res, commonMessages.InvalidCredentials);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};

module.exports = { registerUser, loginUser };
