import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const password = process.env.PASSWORD;
const gmail = process.env.GMAIL;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // explicitly set Gmail SMTP
  port: 465, // SSL
  secure: true,
  auth: {
    user: gmail,
    pass: password,
  },
});

export default transporter;
