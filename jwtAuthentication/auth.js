import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const jwtKey = process.env.JWTKEY
function authenticateToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      message: "Token required",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtKey);
    req.user = decoded; // attach decoded payload to requesti
    next();
  } catch (error) {
    console.log(error.message)
    return res.status(401).json({ message: "Token invalid or expired" });
  }
}

export default authenticateToken