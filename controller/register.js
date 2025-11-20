import register from "../mongodb/newUserSchema.js";
import transporter from "../nodemailer/nodemailerConfig.js";
import generateOtp from "../nodemailer/code.js";
import bcrypt from "bcrypt";

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
          await transporter.sendMail({
            from: "StasHit",
            to: gmail,
            subject: "🔐 Verify Your StasHit Account",
            text: `Use this code to verify your account: ${code}`,
            html: `<p>Use this code to verify your account: <b>${code}</b></p>`,
          });
        } catch (error) {
          console.log(error.message);
          return res.status(500).json({
            message: "failed to send OTP",
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
