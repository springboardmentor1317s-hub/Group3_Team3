import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getEventComments,
  postComment,
  replyToComment,
  toggleLike,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// NOTE: specific paths (/event/:eventId) must come BEFORE /:id

// Get all comments for an event
router.get(   "/event/:eventId", protect, getEventComments);

// Post a new comment on an event
router.post(  "/event/:eventId", protect, postComment);

// Reply to a comment (students + admins both)
router.post(  "/:id/reply",      protect, replyToComment);

// Toggle like
router.post(  "/:id/like",       protect, toggleLike);

// Delete comment or reply
router.delete("/:id",            protect, deleteComment);

export default router;