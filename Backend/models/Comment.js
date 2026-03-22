import mongoose from "mongoose";

// ── Reply sub-schema ──────────────────────────────────────────────────────────
const replySchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    content: {
      type:      String,
      required:  [true, "Reply content is required."],
      maxlength: [500, "Reply cannot exceed 500 characters."],
      trim:      true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// ── Main Comment schema ───────────────────────────────────────────────────────
const commentSchema = new mongoose.Schema(
  {
    event: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Event",
      required: [true, "Event is required."],
    },
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: [true, "User is required."],
    },
    content: {
      type:      String,
      required:  [true, "Comment content is required."],
      maxlength: [500, "Comment cannot exceed 500 characters."],
      trim:      true,
    },
    likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [replySchema],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;