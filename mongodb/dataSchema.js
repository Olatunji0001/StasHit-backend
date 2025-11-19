import mongoose from "mongoose";

const details = new mongoose.Schema(
  {
    account_owner: {
      gmail: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },

    contactname: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const saveDetails = mongoose.model("information", details);
export default saveDetails;
