import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender:    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    eventId:   { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
    type: {
      type: String,
      enum: [
        "admin_approval_request",
        "admin_approved",
        "admin_rejected",
        "event_registration",
        "registration_approved",
        "registration_rejected",
        "event_created",
        "event_updated",
        "event_feedback",          // ✅ NEW — student submitted feedback
        "general",
      ],
      required: true,
    },
    title:               { type: String, required: true },
    message:             { type: String, required: true },
    relatedEvent:        { type: mongoose.Schema.Types.ObjectId, ref: "Event",        default: null },
    relatedRegistration: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", default: null },
    relatedUser:         { type: mongoose.Schema.Types.ObjectId, ref: "User",         default: null },
    isRead:  { type: Boolean, default: false },
    readAt:  { type: Date,    default: null  },
  },
  { timestamps: true }
);

notificationSchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;