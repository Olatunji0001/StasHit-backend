import register from "../mongodb/newUserSchema.js";
import saveDetails from "../mongodb/dataSchema.js";
import generateOtp from "../nodemailer/code.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

dotenv.config();

export const registerRoute = async (req, res) => {
  try {
    const { fullname, gmail, password } = req.body;

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

    const existingUser = await register.findOne({
      gmail: gmail,
      verified: true,
    });
    const notVerified = await register.findOne({
      gmail: gmail,
      verified: false,
    });
    
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    if (notVerified) {
      // Generate new OTP
      const newCode = generateOtp();

      // Initialize MailerSend
      if (!process.env.MAIL_SENDER_API) {
        console.error("MailerSend API key is missing");
        return res.status(500).json({
          message: "Email service configuration error",
        });
      }

      const mailerSend = new MailerSend({
        apiKey: process.env.MAIL_SENDER_API,
      });

      // Create email parameters
      const sentFrom = new Sender(process.env.MAIL_SENDER_EMAIL, "StasHit");
      const recipients = [new Recipient(gmail, fullname)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("🔐 New Verification Code - StasHit Account")
        .setHtml(
          `
        <div style="font-family: Arial, sans-serif; max-width:480px; margin:auto; padding:25px; background:#fff; border-radius:10px; border:1px solid #eee;">
          <h2 style="text-align:center; color:#111;">🔐 New Verification Code</h2>
          <p style="text-align:center; color:#444;">Your new verification code is below</p>
          <div style="text-align:center; margin:30px 0; font-size:28px; font-weight:bold; color:#fff; background:#111; padding:15px; border-radius:8px;">
            ${newCode}
          </div>
          <p style="color:#444; font-size:15px; text-align:center;">This code will expire in <b>10 minutes</b></p>
        </div>
      `
        )
        .setText(
          `Your new StasHit verification code is: ${newCode}. This code will expire in 10 minutes.`
        );

      // Send verification email
      try {
        await mailerSend.email.send(emailParams);
        console.log("New OTP sent successfully to unverified user");
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        return res.status(500).json({
          message: "Failed to send verification code",
          error: emailError.message,
        });
      }

      // ✅ FIXED: Update the existing document instead of delete+create
      const hashedPassword = await bcrypt.hash(password, 13);
      
      // Update the existing unverified user
      notVerified.fullname = fullname;
      notVerified.password = hashedPassword;
      notVerified.code = newCode;
      notVerified.codeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      await notVerified.save();

      return res.status(200).json({
        message: "New verification code sent successfully",
        email: gmail,
      });
    }

    // If no existing user (verified or unverified), create a new one
    // Initialize MailerSend with proper error handling
    if (!process.env.MAIL_SENDER_API) {
      console.error("MailerSend API key is missing");
      return res.status(500).json({
        message: "Email service configuration error",
      });
    }

    const mailerSend = new MailerSend({
      apiKey: process.env.MAIL_SENDER_API,
    });

    const code = generateOtp();

    // Create email parameters
    const sentFrom = new Sender(process.env.MAIL_SENDER_EMAIL, "StasHit");
    const recipients = [new Recipient(gmail, fullname)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("🔐 Verify Your StasHit Account")
      .setHtml(
        `
        <div style="font-family: Arial, sans-serif; max-width:480px; margin:auto; padding:25px; background:#fff; border-radius:10px; border:1px solid #eee;">
          <h2 style="text-align:center; color:#111;">🔐 Verify Your StasHit Account</h2>
          <p style="text-align:center; color:#444;">Your verification code is below</p>
          <div style="text-align:center; margin:30px 0; font-size:28px; font-weight:bold; color:#fff; background:#111; padding:15px; border-radius:8px;">
            ${code}
          </div>
          <p style="color:#444; font-size:15px; text-align:center;">This code will expire in <b>10 minutes</b></p>
        </div>
      `
      )
      .setText(
        `Your StasHit verification code is: ${code}. This code will expire in 10 minutes.`
      );

    // Send verification email
    try {
      await mailerSend.email.send(emailParams);
      console.log("OTP sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        message: "Failed to send verification code",
        error: emailError.message,
      });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 13);
    const newUser = new register({
      fullname: fullname,
      gmail: gmail,
      password: hashedPassword,
      verified: false,
      code: code,
      codeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });

    await newUser.save();

    return res.status(200).json({
      message: "Verification code sent successfully",
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