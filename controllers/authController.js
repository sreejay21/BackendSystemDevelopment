const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../store");
const { sendMail } = require("../mailer");

// REGISTER
const registerUser = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "User exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, passwordHash, role };
  users.push(user);

  // ⚠️ sendMail can break tests if SMTP isn’t configured
  try {
    await sendMail(email, "Welcome!", "Thanks for registering!");
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

  res.status(201).json({ message: "User registered" });
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
};

module.exports = { registerUser, loginUser };
