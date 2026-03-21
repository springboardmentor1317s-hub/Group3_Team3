import Comment from "../models/Comment.js";
import Event   from "../models/Event.js";

// ── Populate helpers ──────────────────────────────────────────────────────────
const POPULATE_USER = { path: "user", select: "name email role college profileImage" };
const POPULATE_REPLIES = {
  path:     "replies",
  populate: { path: "user", select: "name email role college profileImage" },
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET /api/comments/event/:eventId — Get all comments for an event
// ─────────────────────────────────────────────────────────────────────────────
export const getEventComments = async (req, res) => {
  try {
    const { eventId } = req.params;

    const comments = await Comment.find({ event: eventId })
      .populate(POPULATE_USER)
      .populate(POPULATE_REPLIES)
      .sort({ createdAt: -1 });

    res.json({ comments, total: comments.length });
  } catch (err) {
    console.error("getEventComments error:", err);
    res.status(500).json({ message: "Server error while fetching comments." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. POST /api/comments/event/:eventId — Post a new comment
// ─────────────────────────────────────────────────────────────────────────────
export const postComment = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { content } = req.body;
    const userId      = req.user.id;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Comment content is required." });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found." });

    const comment = await Comment.create({
      event:   eventId,
      user:    userId,
      content: content.trim(),
    });

    const populated = await Comment.findById(comment._id)
      .populate(POPULATE_USER)
      .populate(POPULATE_REPLIES);

    res.status(201).json({
      message: "Comment posted successfully.",
      comment: populated,
    });
  } catch (err) {
    console.error("postComment error:", err);
    res.status(500).json({ message: "Server error while posting comment." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. POST /api/comments/:id/reply — Reply to a comment (students + admins)
// ─────────────────────────────────────────────────────────────────────────────
export const replyToComment = async (req, res) => {
  try {
    const { id }      = req.params;
    const { content } = req.body;
    const userId      = req.user.id;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Reply content is required." });
    }

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found." });

    comment.replies.push({ user: userId, content: content.trim() });
    await comment.save();

    const updated = await Comment.findById(id)
      .populate(POPULATE_USER)
      .populate(POPULATE_REPLIES);

    const newReply = updated.replies[updated.replies.length - 1];

    res.status(201).json({
      message: "Reply posted successfully.",
      reply:   newReply,
      comment: updated,
    });
  } catch (err) {
    console.error("replyToComment error:", err);
    res.status(500).json({ message: "Server error while posting reply." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. POST /api/comments/:id/like — Toggle like on comment or reply
// ─────────────────────────────────────────────────────────────────────────────
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Try top-level comment first
    const comment = await Comment.findById(id);
    if (comment) {
      const alreadyLiked = comment.likes.map(String).includes(String(userId));
      if (alreadyLiked) {
        comment.likes = comment.likes.filter((l) => l.toString() !== userId.toString());
      } else {
        comment.likes.push(userId);
      }
      await comment.save();
      return res.json({
        message: alreadyLiked ? "Like removed." : "Liked.",
        likes:   comment.likes.length,
      });
    }

    // Try reply inside any comment
    const parentComment = await Comment.findOne({ "replies._id": id });
    if (!parentComment) {
      return res.status(404).json({ message: "Comment or reply not found." });
    }

    const reply        = parentComment.replies.id(id);
    const alreadyLiked = reply.likes.map(String).includes(String(userId));

    if (alreadyLiked) {
      reply.likes = reply.likes.filter((l) => l.toString() !== userId.toString());
    } else {
      reply.likes.push(userId);
    }
    await parentComment.save();

    res.json({
      message: alreadyLiked ? "Like removed." : "Liked.",
      likes:   reply.likes.length,
    });
  } catch (err) {
    console.error("toggleLike error:", err);
    res.status(500).json({ message: "Server error while toggling like." });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. DELETE /api/comments/:id — Delete comment or reply
//    Own = any user | Others = admin only
// ─────────────────────────────────────────────────────────────────────────────
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "college_admin" || req.user.role === "super_admin";

    // Try top-level comment
    const comment = await Comment.findById(id);
    if (comment) {
      const isOwner = comment.user.toString() === userId.toString();
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "You can only delete your own comments." });
      }
      await Comment.findByIdAndDelete(id);
      return res.json({ message: "Comment deleted successfully." });
    }

    // Try reply
    const parentComment = await Comment.findOne({ "replies._id": id });
    if (!parentComment) {
      return res.status(404).json({ message: "Comment or reply not found." });
    }

    const reply   = parentComment.replies.id(id);
    const isOwner = reply.user.toString() === userId.toString();

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete your own replies." });
    }

    parentComment.replies = parentComment.replies.filter(
      (r) => r._id.toString() !== id
    );
    await parentComment.save();

    res.json({ message: "Reply deleted successfully." });
  } catch (err) {
    console.error("deleteComment error:", err);
    res.status(500).json({ message: "Server error while deleting comment." });
  }
};