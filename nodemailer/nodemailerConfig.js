import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const password = process.env.PASSWORD;
const gmail = process.env.GMAIL;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmail,
    pass: password,
  },
});

export default transporter;
