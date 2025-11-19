import mongoose from "mongoose";

const newUser = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    gmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    code: {
      type: Number,
    },
  },
  { timestamps: true }
);

const register = mongoose.model("Users", newUser);

export default register;
