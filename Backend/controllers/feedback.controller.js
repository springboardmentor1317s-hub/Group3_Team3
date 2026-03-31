import FeedbackModel      from "../models/Feedback.js";
import EventModel         from "../models/Event.js";
import RegistrationModel  from "../models/Registration.js";
import NotificationModel  from "../models/Notification.js";
import UserModel          from "../models/User.model.js";

const Feedback     = FeedbackModel;
const Event        = EventModel;
const Registration = RegistrationModel;
const Notification = NotificationModel;
const User         = UserModel;

const POPULATE_FEEDBACK = [
  { path: "student", select: "name email college profileImage role" },
  { path: "event",   select: "title category start_date end_date location collegeName image" },
  { path: "replies", populate: { path: "student", select: "name college profileImage role" } },
];

const notify = async (io, data) => {
  try {
    const n = await Notification.create(data);
    if (io) io.to(`user_${data.recipient.toString()}`).emit("new_notification", { notification: n });
    return n;
  } catch (err) {
    console.error("notify error:", err.message);
  }
};

// ── 1. Submit feedback ────────────────────────────────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;
    const studentId = req.user.id;

    if (!eventId || !comment)
      return res.status(400).json({ message: "eventId and comment are required." });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found." });

    const existing = await Feedback.findOne({ event: eventId, student: studentId });
    if (existing)
      return res.status(400).json({ message: "You have already submitted feedback for this event." });

    const feedback = await Feedback.create({
      event:   eventId,
      student: studentId,
      rating:  rating || null,
      comment: comment.trim(),
    });

    const populated = await Feedback.findById(feedback._id).populate(POPULATE_FEEDBACK);

    const io      = req.app.get("io");
    const student = await User.findById(studentId).select("name college");
    const stars   = rating ? `${"⭐".repeat(rating)} (${rating}/5)` : "No rating";

    const collegeAdmin = await User.findOne({
      role:       "college_admin",
      college:    event.collegeName,
      isApproved: true,
    });

    if (collegeAdmin) {
      await notify(io, {
        recipient:    collegeAdmin._id,
        sender:       studentId,
        type:         "event_feedback",
        title:        "New Student Feedback ⭐",
        message:      `${student.name} from ${student.college} submitted feedback for "${event.title}". Rating: ${stars}`,
        relatedEvent: eventId,
        relatedUser:  studentId,
      });
    }

    const superAdmins = await User.find({ role: "super_admin" }, "_id");
    await Promise.all(
      superAdmins.map((sa) =>
        notify(io, {
          recipient:    sa._id,
          sender:       studentId,
          type:         "event_feedback",
          title:        "New Student Feedback ⭐",
          message:      `${student.name} submitted feedback for "${event.title}" (${event.collegeName}). Rating: ${stars}`,
          relatedEvent: eventId,
          relatedUser:  studentId,
        })
      )
    );

    res.status(201).json({ message: "Feedback submitted successfully!", feedback: populated });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "You have already submitted feedback for this event." });
    console.error("submitFeedback error:", err);
    res.status(500).json({ message: "Server error while submitting feedback." });
  }
};

// ── 2. Update feedback ────────────────────────────────────────────────────────
export const updateFeedback = async (req, res) => {
  try {
    const { id }              = req.params;
    const { rating, comment } = req.body;
    const studentId           = req.user.id;

    const fb = await Feedback.findById(id);
    if (!fb) return res.status(404).json({ message: "Feedback not found." });
    if (fb.student.toString() !== studentId.toString())
      return res.status(403).json({ message: "You can only edit your own feedback." });

    if (rating  !== undefined) fb.rating  = rating;
    if (comment !== undefined) fb.comment = comment.trim();
    await fb.save();

    const populated = await Feedback.findById(id).populate(POPULATE_FEEDBACK);
    res.json({ message: "Feedback updated.", feedback: populated });
  } catch (err) {
    console.error("updateFeedback error:", err);
    res.status(500).json({ message: "Server error while updating feedback." });
  }
};

// ── 3. Get my feedbacks ───────────────────────────────────────────────────────
export const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.user.id })
      .populate("event", "title category start_date end_date location collegeName image")
      .sort({ createdAt: -1 });
    res.json({ feedbacks });
  } catch (err) {
    console.error("getMyFeedbacks error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── 4. Get event feedbacks ────────────────────────────────────────────────────
export const getEventFeedbacks = async (req, res) => {
  try {
    const { eventId } = req.params;
    const feedbacks   = await Feedback.find({ event: eventId })
      .populate("student", "name college profileImage role")
      .populate({ path: "replies", populate: { path: "student", select: "name college profileImage role" } })
      .sort({ createdAt: -1 });

    const rated     = feedbacks.filter((f) => f.rating);
    const avgRating = rated.length > 0
      ? (rated.reduce((s, f) => s + f.rating, 0) / rated.length).toFixed(1)
      : null;

    res.json({ feedbacks, avgRating, totalCount: feedbacks.length });
  } catch (err) {
    console.error("getEventFeedbacks error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

// ── 5. Like ───────────────────────────────────────────────────────────────────
export const likeFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const fb     = await Feedback.findById(id);
    if (!fb) return res.status(404).json({ message: "Feedback not found." });

    const liked    = fb.likes.map(String).includes(String(userId));
    const disliked = fb.dislikes.map(String).includes(String(userId));
    if (liked) {
      fb.likes = fb.likes.filter((l) => l.toString() !== userId.toString());
    } else {
      fb.likes.push(userId);
      if (disliked) fb.dislikes = fb.dislikes.filter((d) => d.toString() !== userId.toString());
    }
    await fb.save();
    res.json({ message: liked ? "Like removed." : "Liked.", likes: fb.likes.length, dislikes: fb.dislikes.length });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error." }); }
};

// ── 6. Dislike ────────────────────────────────────────────────────────────────
export const dislikeFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const fb     = await Feedback.findById(id);
    if (!fb) return res.status(404).json({ message: "Feedback not found." });

    const disliked = fb.dislikes.map(String).includes(String(userId));
    const liked    = fb.likes.map(String).includes(String(userId));
    if (disliked) {
      fb.dislikes = fb.dislikes.filter((d) => d.toString() !== userId.toString());
    } else {
      fb.dislikes.push(userId);
      if (liked) fb.likes = fb.likes.filter((l) => l.toString() !== userId.toString());
    }
    await fb.save();
    res.json({ message: disliked ? "Dislike removed." : "Disliked.", likes: fb.likes.length, dislikes: fb.dislikes.length });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error." }); }
};

// ── 7. Reply ──────────────────────────────────────────────────────────────────
export const replyToFeedback = async (req, res) => {
  try {
    const { id }      = req.params;
    const { comment } = req.body;
    const studentId   = req.user.id;

    if (!comment?.trim()) return res.status(400).json({ message: "Reply comment is required." });

    const fb = await Feedback.findById(id);
    if (!fb) return res.status(404).json({ message: "Feedback not found." });

    fb.replies.push({ student: studentId, comment: comment.trim() });
    await fb.save();

    const populated = await Feedback.findById(id)
      .populate("student", "name college profileImage role")
      .populate({ path: "replies", populate: { path: "student", select: "name college profileImage role" } });

    res.status(201).json({ message: "Reply added.", feedback: populated });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error." }); }
};

// ── 8. Delete ─────────────────────────────────────────────────────────────────
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const fb     = await Feedback.findById(id);
    if (!fb) return res.status(404).json({ message: "Feedback not found." });

    if (req.user.role === "student" && fb.student.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "You can only delete your own feedback." });

    await Feedback.findByIdAndDelete(id);
    res.json({ message: "Feedback deleted successfully." });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error." }); }
};

// ── 9. Admin analysis ─────────────────────────────────────────────────────────
export const getAdminAnalysis = async (req, res) => {
  try {
    let eventFilter = {};
    if (req.user.role === "college_admin") {
      // ✅ FIXED: was req.user.college_id → correct field is req.user._id
      const evts  = await Event.find({ college_id: req.user._id }, "_id");
      eventFilter = { event: { $in: evts.map((e) => e._id) } };
    }

    const pipeline = [
      { $match: eventFilter },
      { $group: { _id: "$event", avgRating: { $avg: "$rating" }, feedbackCount: { $sum: 1 }, ratings: { $push: "$rating" } } },
      { $lookup: { from: "events", localField: "_id", foreignField: "_id", as: "eventInfo" } },
      { $unwind: "$eventInfo" },
      { $project: { _id: "$eventInfo._id", title: "$eventInfo.title", category: "$eventInfo.category", collegeName: "$eventInfo.collegeName", start_date: "$eventInfo.start_date", avgRating: { $round: ["$avgRating", 1] }, feedbackCount: 1, ratings: 1 } },
      { $sort: { avgRating: -1 } },
    ];

    const raw    = await Feedback.aggregate(pipeline);
    const events = raw.map((e) => {
      const dist = { 1:0, 2:0, 3:0, 4:0, 5:0 };
      (e.ratings || []).forEach((r) => { if (r >= 1 && r <= 5) dist[r]++; });
      return { _id: e._id, title: e.title, category: e.category, collegeName: e.collegeName, start_date: e.start_date, avgRating: e.avgRating, feedbackCount: e.feedbackCount, ratingDistribution: dist };
    });

    const allFbs = await Feedback.find(eventFilter, "rating");
    const gDist  = { 1:0, 2:0, 3:0, 4:0, 5:0 };
    allFbs.forEach((f) => { if (f.rating >= 1 && f.rating <= 5) gDist[f.rating]++; });
    const rated  = allFbs.filter((f) => f.rating).length;
    const gAvg   = rated > 0
      ? (allFbs.filter((f) => f.rating).reduce((s, f) => s + f.rating, 0) / rated).toFixed(1)
      : null;

    res.json({ events, globalStats: { totalEvents: events.length, totalFeedbacks: allFbs.length, globalAvg: gAvg, globalDistribution: gDist } });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error." }); }
};

// ── 10. Admin all feedbacks ───────────────────────────────────────────────────
export const getAllFeedbacksAdmin = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "college_admin") {
      // ✅ FIXED: was req.user.college_id → correct field is req.user._id
      const evts  = await Event.find({ college_id: req.user._id }, "_id");
      query.event = { $in: evts.map((e) => e._id) };
    }
    const feedbacks = await Feedback.find(query)
      .populate("student", "name email college profileImage")
      .populate("event", "title category start_date location collegeName")
      .populate({ path: "replies", populate: { path: "student", select: "name college" } })
      .sort({ createdAt: -1 });
    res.json({ feedbacks, total: feedbacks.length });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error." }); }
};