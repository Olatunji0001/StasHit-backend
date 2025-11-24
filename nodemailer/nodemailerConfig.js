import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Load env variables
const MAIL_SENDER_SERVER = process.env.MAIL_SENDER_SERVER;   // e.g. smtp.mailersend.net
const MAIL_SENDER_PORT = process.env.MAIL_SENDER_PORT;       // e.g. 587   // e.g. 465 (optional)
const MAIL_SENDER_EMAIL = process.env.MAIL_SENDER_EMAIL;     // SMTP username
const MAIL_SENDER_PASSWORD = process.env.MAIL_SENDER_PASSWORD; // SMTP password

const transporter = nodemailer.createTransport({
  host: MAIL_SENDER_SERVER,
  port: Number(MAIL_SENDER_PORT), 
  secure: false,
  auth: {
    user: MAIL_SENDER_EMAIL,
    pass: MAIL_SENDER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export default transporter;
