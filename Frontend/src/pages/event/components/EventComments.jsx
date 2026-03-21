// src/pages/event/components/EventComments.jsx
import { useState, useEffect } from "react";
import api from "../../../services/api";
import { getUser } from "../../../services/auth";
import { toast } from "react-toastify";
import {
  FaThumbsUp,
  FaReply,
  FaTrash,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp,
  FaCommentAlt,
  FaSpinner,
  FaUserShield,
} from "react-icons/fa";

// ── helpers ──────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const diff  = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-purple-500", "bg-emerald-500",
  "bg-pink-500",   "bg-orange-500", "bg-teal-500",
  "bg-blue-500",   "bg-rose-500",
];
function avatarBg(name = "") {
  let s = 0;
  for (const c of name) s += c.charCodeAt(0);
  return AVATAR_COLORS[s % AVATAR_COLORS.length];
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name = "", size = "w-9 h-9", textSize = "text-sm" }) {
  return (
    <div className={`${size} ${avatarBg(name)} rounded-full flex items-center justify-center font-bold text-white ${textSize} flex-shrink-0`}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

// ── Role badge ─────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  if (role === "college_admin" || role === "super_admin") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
        <FaUserShield className="text-[9px]" />
        {role === "super_admin" ? "Super Admin" : "Admin"}
      </span>
    );
  }
  return null;
}

// ── Single Reply Card ─────────────────────────────────────────────────────────
function ReplyCard({ reply, onLike, onDelete, currentUser }) {
  const isOwn     = reply.user?._id === currentUser?.id || reply.user?._id === currentUser?._id;
  const isAdmin   = currentUser?.role === "college_admin" || currentUser?.role === "super_admin";
  const liked     = reply.likes?.includes(currentUser?.id || currentUser?._id);
  const canDelete = isOwn || isAdmin;

  return (
    <div className="flex gap-3 py-3 border-b border-slate-50 last:border-0">
      <Avatar name={reply.user?.name} size="w-7 h-7" textSize="text-xs" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-bold text-slate-800 text-sm">{reply.user?.name || "Anonymous"}</span>
          <RoleBadge role={reply.user?.role} />
          {isOwn && <span className="text-[10px] text-slate-400 font-medium">You</span>}
          <span className="text-xs text-slate-400 ml-auto">{timeAgo(reply.createdAt)}</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{reply.content}</p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onLike(reply._id, true)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${
              liked ? "text-indigo-600" : "text-slate-400 hover:text-indigo-500"
            }`}
          >
            <FaThumbsUp className={liked ? "text-indigo-600" : ""} />
            {reply.likes?.length || 0}
          </button>
          {canDelete && (
            <button
              onClick={() => onDelete(reply._id, true)}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-red-500 transition-all ml-auto"
            >
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Single Comment Card ───────────────────────────────────────────────────────
function CommentCard({ comment, onLike, onDelete, onReply, currentUser }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText,    setReplyText]    = useState("");
  const [showReplies,  setShowReplies]  = useState(true);
  const [submitting,   setSubmitting]   = useState(false);

  const isOwn     = comment.user?._id === currentUser?.id || comment.user?._id === currentUser?._id;
  const isAdmin   = currentUser?.role === "college_admin" || currentUser?.role === "super_admin";
  const liked     = comment.likes?.includes(currentUser?.id || currentUser?._id);
  const canDelete = isOwn || isAdmin;

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    await onReply(comment._id, replyText.trim());
    setReplyText("");
    setShowReplyBox(false);
    setShowReplies(true);
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 mb-4">
      {/* Comment header */}
      <div className="flex items-start gap-3">
        <Avatar name={comment.user?.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-slate-800 text-sm">{comment.user?.name || "Anonymous"}</span>
            <RoleBadge role={comment.user?.role} />
            {isOwn && <span className="text-[10px] text-slate-400 font-medium">You</span>}
            <span className="text-xs text-slate-400 ml-auto">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">{comment.content}</p>

          {/* Action row */}
          <div className="flex items-center gap-4 text-xs">
            {/* Like */}
            <button
              onClick={() => onLike(comment._id, false)}
              className={`flex items-center gap-1.5 font-semibold transition-all px-3 py-1.5 rounded-xl ${
                liked
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-400 hover:bg-slate-100 hover:text-indigo-500"
              }`}
            >
              <FaThumbsUp /> {comment.likes?.length || 0}
            </button>

            {/* Reply */}
            {currentUser && (
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className={`flex items-center gap-1.5 font-semibold transition-all px-3 py-1.5 rounded-xl ${
                  showReplyBox
                    ? "bg-purple-50 text-purple-600"
                    : "text-slate-400 hover:bg-slate-100 hover:text-purple-500"
                }`}
              >
                <FaReply /> Reply
              </button>
            )}

            {/* Toggle replies */}
            {comment.replies?.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 font-semibold ml-1 px-2 py-1 rounded-xl hover:bg-indigo-50 transition-all"
              >
                {showReplies ? <FaChevronUp /> : <FaChevronDown />}
                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}

            {/* Delete */}
            {canDelete && (
              <button
                onClick={() => onDelete(comment._id, false)}
                className="flex items-center gap-1 text-slate-300 hover:text-red-500 font-semibold transition-all px-2 py-1 rounded-xl hover:bg-red-50 ml-auto"
              >
                <FaTrash /> Delete
              </button>
            )}
          </div>

          {/* Reply input */}
          {showReplyBox && currentUser && (
            <div className="mt-4 flex gap-3 items-start">
              <Avatar name={currentUser.name} size="w-7 h-7" textSize="text-xs" />
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.user?.name?.split(" ")[0] || "this comment"}...`}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none resize-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit();
                    }
                  }}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => { setShowReplyBox(false); setReplyText(""); }}
                    className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim() || submitting}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow hover:shadow-md disabled:opacity-50 transition-all"
                  >
                    {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Replies list */}
          {showReplies && comment.replies?.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-indigo-100">
              {comment.replies.map((reply) => (
                <ReplyCard
                  key={reply._id}
                  reply={reply}
                  onLike={onLike}
                  onDelete={onDelete}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main EventComments Component ──────────────────────────────────────────────
function EventComments({ eventId }) {
  const currentUser = getUser();

  const [comments,    setComments]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [newComment,  setNewComment]  = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [sortBy,      setSortBy]      = useState("newest"); // newest | oldest | most_liked

  useEffect(() => {
    if (eventId) fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/comments/event/${eventId}`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Post a top-level comment
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) { toast.error("Please login to comment."); return; }

    try {
      setSubmitting(true);
      const res = await api.post(`/comments/event/${eventId}`, { content: newComment.trim() });
      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reply to a comment
  const handleReply = async (commentId, replyText) => {
    if (!currentUser) { toast.error("Please login to reply."); return; }
    try {
      const res = await api.post(`/comments/${commentId}/reply`, { content: replyText });
      // Update the specific comment's replies in state
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, replies: [...(c.replies || []), res.data.reply] } : c
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post reply.");
      throw err;
    }
  };

  // Toggle like on comment or reply
  const handleLike = async (id, isReply) => {
    if (!currentUser) { toast.error("Please login to like."); return; }
    const userId = currentUser.id || currentUser._id;
    try {
      await api.post(`/comments/${id}/like`);
      // Optimistic update
      setComments((prev) =>
        prev.map((c) => {
          if (!isReply && c._id === id) {
            const liked = c.likes?.includes(userId);
            return {
              ...c,
              likes: liked
                ? c.likes.filter((l) => l !== userId)
                : [...(c.likes || []), userId],
            };
          }
          if (isReply && c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) => {
                if (r._id === id) {
                  const liked = r.likes?.includes(userId);
                  return {
                    ...r,
                    likes: liked
                      ? r.likes.filter((l) => l !== userId)
                      : [...(r.likes || []), userId],
                  };
                }
                return r;
              }),
            };
          }
          return c;
        })
      );
    } catch (err) {
      toast.error("Failed to like.");
    }
  };

  // Delete comment or reply
  const handleDelete = async (id, isReply) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${id}`);
      if (!isReply) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      } else {
        setComments((prev) =>
          prev.map((c) => ({
            ...c,
            replies: (c.replies || []).filter((r) => r._id !== id),
          }))
        );
      }
      toast.success("Deleted.");
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  // Sort comments
  const sorted = [...comments].sort((a, b) => {
    if (sortBy === "oldest")      return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "most_liked")  return (b.likes?.length || 0) - (a.likes?.length || 0);
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FaCommentAlt className="text-indigo-500" />
          Discussion
          <span className="text-base font-semibold text-gray-400">({comments.length})</span>
        </h3>
        {comments.length > 1 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most_liked">Most Liked</option>
          </select>
        )}
      </div>

      {/* New comment input */}
      {currentUser ? (
        <div className="flex gap-3 mb-8">
          <Avatar name={currentUser.name} />
          <div className="flex-1">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this event..."
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) handleSubmitComment();
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400">Ctrl+Enter to post</span>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-700 font-semibold">
          <FaCommentAlt />
          <a href="/login" className="underline hover:text-indigo-900">Sign in</a> to join the discussion
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <FaCommentAlt className="text-5xl mx-auto mb-3 opacity-20" />
          <p className="font-semibold text-slate-500 text-base">No comments yet</p>
          <p className="text-sm mt-1">Be the first to start the discussion!</p>
        </div>
      ) : (
        <div>
          {sorted.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onDelete={handleDelete}
              onReply={handleReply}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventComments;