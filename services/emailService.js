//services/emailService.js
//@ts-nocheck
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 587,
  auth: {
    user: "wilme03gonzalez@gmail.com",
    pass: "rayuevjojmovjmhe",
  },
  tls:{
    rejectUnauthorized: false,
  }
});

module.exports = transporter;