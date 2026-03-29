import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",   // ✅ THIS IS IMPORTANT
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Registration", registrationSchema);