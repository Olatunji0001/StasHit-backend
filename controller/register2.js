import register from "../mongodb/newUserSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerRoute2 = async (req, res) => {
  try {
    const { gmail, otp } = req.body;
    const jwtKey = process.env.JWTKEY;

    if (!(gmail && otp)) {
      return res.status(400).json({
        message: "Enter your gmail and the OTP sent to your gmail",
      });
    }
    if (gmail && otp) {
      const checkUser = await register.findOne({
        gmail: gmail,
        verified: true,
      });
      if (checkUser) {
        return res.status(200).json({
          message: "Your account is verified already",
        });
      } else {
        const check = await register.findOne({
          gmail: gmail,
          verified: false,
          code: otp,
        });
        if (check) {
          await register.updateOne(
            { gmail: gmail },
            { $set: { verified: true, code: "" } }
          );
          const payload = {
            gmail: gmail,
            id: check._id,
          };
          const jwtToken = jwt.sign(payload, jwtKey, { expiresIn: "33d" });
          res.cookie("access_token", jwtToken, {
            httpOnly: true, // cannot be accessed by JS
            secure: true, // true in production with HTTPS
            sameSite: "none", // prevents CSRF
            maxAge: 33 * 24 * 60 * 60 * 1000,
          });
          return res.status(201).json({
            message: "Account created succssfully",
          });
        } else {
          return res.status(404).json({
            message: "Invalid OTP or Gmail not found",
          });
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "failed to verify OTP, try again later",
      error: error.message,
    });
  }
};
