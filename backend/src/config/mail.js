import nodemailer from "nodemailer";

const pass = (process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export default transporter;