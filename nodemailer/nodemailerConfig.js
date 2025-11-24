import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const password = process.env.PASSWORD;
const gmail = process.env.GMAIL;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: gmail,
    pass: password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
