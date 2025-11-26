import register from "../mongodb/newUserSchema.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const registerRoute = async (req, res) => {
  try {
    const { fullname, gmail, password } = req.body;
    const jwtKey = process.env.JWTKEY;

    // Validate input fields
    if (!fullname || !gmail || !password) {
      return res.status(400).json({
        message: "All fields are required",
        errorMessage: "bad request",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await register.findOne({ gmail: gmail });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 13);
    const newUser = new register({
      fullname: fullname,
      gmail: gmail,
      password: hashedPassword,
    });

    await newUser.save();
    const payload = {
      gmail: gmail,
      id: newUser._id,
    };
    const jwtToken = jwt.sign(payload, jwtKey, { expiresIn: "33d" });
    res.cookie("access_token", jwtToken, {
      httpOnly: true, // cannot be accessed by JS
      secure: true, // true in production with HTTPS
      sameSite: "none", // prevents CSRF
      maxAge: 33 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Account created successfully",
      email: gmail,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error, please try again later",
      error: error.message,
    });
  }
};
