import crypto from "crypto";

const generateOtp = () => {
  // Generate a random integer between 0 and 999999
  const otp = crypto.randomInt(0, 1000000);
  // Pad with zeros if it’s less than 6 digits
  return otp.toString().padStart(6, "0");
};
export default generateOtp;
