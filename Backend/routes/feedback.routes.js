import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  submitFeedback,
  updateFeedback,
  getMyFeedbacks,
  getEventFeedbacks,
  likeFeedback,
  dislikeFeedback,
  replyToFeedback,
  deleteFeedback,
  getAdminAnalysis,
  getAllFeedbacksAdmin,
} from "../controllers/feedback.controller.js";

const router = express.Router();

// ── NOTE: specific paths (/my, /admin/...) BEFORE /:id ───────────────────────

// Student routes
router.get(   "/my",              protect,                                            getMyFeedbacks);
router.get(   "/event/:eventId",  protect,                                            getEventFeedbacks);
router.post(  "/",                protect,                                            submitFeedback);
router.put(   "/:id",             protect,                                            updateFeedback);
router.post(  "/:id/like",        protect,                                            likeFeedback);
router.post(  "/:id/dislike",     protect,                                            dislikeFeedback);
router.post(  "/:id/reply",       protect,                                            replyToFeedback);

// Admin routes
router.get(   "/admin/analysis",  protect, authorize("college_admin","super_admin"),  getAdminAnalysis);
router.get(   "/admin/all",       protect, authorize("college_admin","super_admin"),  getAllFeedbacksAdmin);
router.delete("/:id",             protect, authorize("college_admin","super_admin"),  deleteFeedback);

export default router;