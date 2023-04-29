const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (options) => {
  const { email, subject, message } = options;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
		},
		secure: false
  });

  const content = {
    from: `Admin - ${process.env.EMAIL_ACCOUNT} - Mimin Shop`,
    to: email,
    subject,
    text: message,
  };

  await transporter.sendMail(content);
};

module.exports = sendMail;
