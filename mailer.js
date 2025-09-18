const nodemailer = require("nodemailer");

let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  console.warn("EMAIL_USER or EMAIL_PASS not set. Emails will not be sent.");
}


async function sendMail(to, subject, text) {
  if (!transporter) {
    console.log(`Skipping email to ${to}. Transporter not configured.`);
    return;
  }

  let info = await transporter.sendMail({
    from: `"Event Platform" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = { sendMail };
