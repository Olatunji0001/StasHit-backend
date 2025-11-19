import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGODB_URL

const connection = async () => {
  try {
    const connect = await mongoose.connect(connectionString);
    if (connect) {
      console.log("**CONNECTED TO MONGODB**")
    }
  } catch (error) {
    console.log(error.message)
  }
}

export default connection;
