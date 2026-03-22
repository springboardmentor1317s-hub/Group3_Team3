import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    student:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment:  { type: String, required: [true, "Reply text is required."], maxlength: [500, "Reply cannot exceed 500 characters."], trim: true },
    likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const feedbackSchema = new mongoose.Schema(
  {
    event:   { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: [true, "Event is required."] },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: [true, "Student is required."] },
    rating:  { type: Number, min: [1, "Rating must be at least 1."], max: [5, "Rating cannot exceed 5."], default: null },
    comment: { type: String, required: [true, "Comment is required."], maxlength: [500, "Comment cannot exceed 500 characters."], trim: true },
    likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies:  [replySchema],
  },
  { timestamps: true }
);

feedbackSchema.index({ event: 1, student: 1 }, { unique: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;