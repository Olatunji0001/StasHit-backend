import register from "../mongodb/newUserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const loginRoute = async (req, res) => {
  try {
    const { gmail, password } = req.body;
    const jwtKey = process.env.JWTKEY;
    if (!(gmail && password)) {
      return res.status(400).json({
        message: "input all field",
      });
    }
    if (gmail && password) {
      const check = await register.findOne({ gmail: gmail });
      if (check) {
        const verify = await register.findOne({ gmail: gmail, verified: true });
        if (!verify) {
          return res.status(400).json({
            message: "Your account is not verified yet",
          });
        }
        if (verify) {
          const confirmPassword = await bcrypt.compare(
            password,
            verify.password
          );
          if (confirmPassword === true) {
            const payload = {
              gmail: gmail,
              id: check._id,
            };
            const token = jwt.sign(payload, jwtKey, { expiresIn: "33d" });
            res.cookie("access_token", token, {
              httpOnly: true, // cannot be accessed by JS
              secure: false, // true in production with HTTPS
              sameSite: "strict", // prevents CSRF
              maxAge: 33 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
              message: "login successful",
            });
          } else {
            return res.status(400).json({
              message: "Incorrect password",
            });
          }
        }
      } else {
        return res.status(404).json({
          message: "Gmail not registered yet, please sign up",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "server error, try again later",
    });
  }
};
