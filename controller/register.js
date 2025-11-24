import register from "../mongodb/newUserSchema.js";
import transporter from "../nodemailer/nodemailerConfig.js";
import generateOtp from "../nodemailer/code.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const registerRoute = async (req, res) => {
  try {
    const { fullname, gmail, password } = req.body;
    const code = generateOtp();

    if (!(fullname && gmail && password)) {
      return res.status(400).json({
        message: "input all field",
        errorMessage: "bad request",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    if (fullname && gmail && password) {
      const check = await register.findOne({ gmail: gmail });
      if (check) {
        return res.status(409).json({
          message: "gmail already exist",
        });
      } else {
        try {
          transporter.sendMail({
            from: `StasHit <${process.env.MAIL_SENDER_EMAIL}>`,
            to: gmail,
            subject: "🔐 Verify Your StasHit Account",
            text: `Use this code to verify your account: ${code}`,
            html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; border: 1px solid #eee;">

        <div style="text-align: center;">
          <h2 style="color: #111; margin-bottom: 5px;">🔐 Verify Your StasHit Account</h2>
          <p style="color: #444; margin-top: 0;">Your verification code is below</p>
        </div>

        <div style="margin: 30px 0; text-align: center;">
          <div style="background: #111; color: white; font-size: 28px; letter-spacing: 6px; padding: 15px; border-radius: 8px; display: inline-block; font-weight: bold;">
            ${code}
          </div>
        </div>

        <p style="color: #444; font-size: 15px;">
          Enter this code in the StasHit app to verify your account.<br />
          This code will expire in <b>10 minutes</b>.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

        <p style="color: #777; font-size: 13px; text-align: center;">
          If you didn’t request this code, please ignore this email.
        </p>

        <div style="text-align: center; margin-top: 15px; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} StasHit. All rights reserved.
        </div>

      </div>
    `,
          });
        } catch (error) {
          console.log(error.message);
          return res.status(500).json({
            message: "Failed to send OTP",
            error: error.message,
          });
        }

        const hasedPassword = await bcrypt.hash(password, 13);
        const saveUser = new register({
          fullname: fullname,
          gmail: gmail,
          password: hasedPassword,
          verified: false,
          code: code,
        });

        await saveUser.save();
        // const check = await register.findOne({ gmail: gmail, verified: false });
        // if (check) {
        //   setTimeout(async () => {
        //     await register.updateOne({ gmail: gmail }, { $set: { code: "" } });
        //   }, 300000);
        // }

        return res.status(200).json({
          message: "OTP sent successfully",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "server error, try again later",
      error: error.message,
    });
  }
};
