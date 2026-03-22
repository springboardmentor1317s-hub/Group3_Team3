// src/pages/student/EventFeedback.jsx
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import { toast } from "react-toastify";
import {
  FaStar, FaThumbsUp, FaThumbsDown, FaReply, FaArrowLeft,
  FaCommentAlt, FaPaperPlane, FaCheckCircle, FaEdit,
  FaSpinner, FaChevronDown, FaChevronUp, FaCalendarAlt,
  FaMapMarkerAlt, FaUserShield,
} from "react-icons/fa";

// ── helpers ───────────────────────────────────────────────────────────────────
const RATING_LABEL = { 1:"Poor 😞", 2:"Fair 😐", 3:"Good 🙂", 4:"Great 😄", 5:"Excellent 🤩" };

function timeAgo(date) {
  const diff  = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day:"numeric", month:"short" });
}

const COLORS = ["bg-indigo-500","bg-purple-500","bg-emerald-500","bg-pink-500","bg-orange-500","bg-teal-500"];
const avBg = (name="") => { let s=0; for(const c of name) s+=c.charCodeAt(0); return COLORS[s%COLORS.length]; };

// ── StarPicker ────────────────────────────────────────────────────────────────
function StarPicker({ value, onChange, readOnly=false }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <button key={s} type="button" disabled={readOnly}
          onMouseEnter={()=>!readOnly&&setHover(s)} onMouseLeave={()=>!readOnly&&setHover(0)}
          onClick={()=>!readOnly&&onChange(s)}
          className={`text-4xl transition-all duration-150 ${readOnly?"cursor-default":"cursor-pointer hover:scale-125"} ${s<=(hover||value)?"text-yellow-400":"text-slate-200"}`}>
          <FaStar />
        </button>
      ))}
    </div>
  );
}

// ── ReviewCard ────────────────────────────────────────────────────────────────
function ReviewCard({ fb, onLike, onDislike, onReply, currentUser }) {
  const [showReplies,  setShowReplies]  = useState(true);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText,    setReplyText]    = useState("");
  const [submitting,   setSubmitting]   = useState(false);

  const uid      = currentUser?.id || currentUser?._id;
  const liked    = fb.likes?.includes(uid);
  const disliked = fb.dislikes?.includes(uid);
  const isOwn    = fb.student?._id === uid;

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    await onReply(fb._id, replyText.trim());
    setReplyText(""); setShowReplyBox(false);
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${avBg(fb.student?.name)} rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}>
            {fb.student?.name?.[0]?.toUpperCase()||"?"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-800 text-sm">{fb.student?.name||"Anonymous"}</span>
              {(fb.student?.role==="college_admin"||fb.student?.role==="super_admin") && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  <FaUserShield className="text-[9px]" /> Admin
                </span>
              )}
              {isOwn && <span className="text-[10px] text-slate-400">You</span>}
            </div>
            <span className="text-xs text-slate-400">{timeAgo(fb.createdAt)}</span>
          </div>
        </div>
        {fb.rating>0 && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {[1,2,3,4,5].map((s)=><FaStar key={s} className={`text-sm ${s<=fb.rating?"text-yellow-400":"text-slate-200"}`} />)}
            <span className="text-sm font-bold text-yellow-500 ml-1">{fb.rating}/5</span>
          </div>
        )}
      </div>

      <p className="text-slate-700 text-sm leading-relaxed mb-4">{fb.comment}</p>

      {/* Actions */}
      <div className="flex items-center gap-3 text-xs flex-wrap">
        <button onClick={()=>onLike(fb._id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${liked?"bg-indigo-100 text-indigo-700":"text-slate-400 hover:bg-slate-100"}`}>
          <FaThumbsUp /> {fb.likes?.length||0}
        </button>
        <button onClick={()=>onDislike(fb._id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${disliked?"bg-red-100 text-red-700":"text-slate-400 hover:bg-slate-100"}`}>
          <FaThumbsDown /> {fb.dislikes?.length||0}
        </button>
        {currentUser && (
          <button onClick={()=>setShowReplyBox(!showReplyBox)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${showReplyBox?"bg-purple-100 text-purple-700":"text-slate-400 hover:bg-slate-100"}`}>
            <FaReply /> Reply
          </button>
        )}
        {fb.replies?.length>0 && (
          <button onClick={()=>setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700 font-bold px-2 py-1 rounded-xl hover:bg-indigo-50 transition-all ml-auto">
            {showReplies?<FaChevronUp/>:<FaChevronDown/>} {fb.replies.length} {fb.replies.length===1?"reply":"replies"}
          </button>
        )}
      </div>

      {/* Reply box */}
      {showReplyBox && currentUser && (
        <div className="mt-4 flex gap-3 items-start">
          <div className={`w-8 h-8 ${avBg(currentUser.name)} rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0 mt-1`}>
            {currentUser.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <textarea rows={2} value={replyText} onChange={(e)=>setReplyText(e.target.value)}
              placeholder={`Reply to ${fb.student?.name?.split(" ")[0]||"this review"}...`}
              className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none resize-none transition-all"
              onKeyDown={(e)=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submitReply();}}} />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={()=>{setShowReplyBox(false);setReplyText("");}} className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={submitReply} disabled={!replyText.trim()||submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow disabled:opacity-50 transition-all">
                {submitting?<FaSpinner className="animate-spin"/>:<FaPaperPlane/>} Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replies */}
      {showReplies && fb.replies?.length>0 && (
        <div className="mt-4 pl-4 border-l-2 border-indigo-100 space-y-3">
          {fb.replies.map((reply)=>(
            <div key={reply._id} className="flex gap-3 pt-3">
              <div className={`w-8 h-8 ${avBg(reply.student?.name)} rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0`}>
                {reply.student?.name?.[0]?.toUpperCase()||"?"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-slate-800 text-sm">{reply.student?.name||"Anonymous"}</span>
                  {(reply.student?.role==="college_admin"||reply.student?.role==="super_admin") && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      <FaUserShield className="text-[9px]"/> Admin
                    </span>
                  )}
                  <span className="text-xs text-slate-400 ml-auto">{timeAgo(reply.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-700">{reply.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
function EventFeedback() {
  const { eventId }  = useParams();
  const location     = useLocation();
  const currentUser  = getUser();

  const event            = location.state?.event            || null;
  const existingFeedback = location.state?.existingFeedback || null;

  const [rating,    setRating]    = useState(existingFeedback?.rating  || 0);
  const [comment,   setComment]   = useState(existingFeedback?.comment || "");
  const [submitting,setSubmitting]= useState(false);
  const [submitted, setSubmitted] = useState(!!existingFeedback);
  const [editMode,  setEditMode]  = useState(!existingFeedback);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFb, setLoadingFb] = useState(true);
  const [sortBy,    setSortBy]    = useState("newest");

  useEffect(()=>{ fetchFeedbacks(); }, [eventId]);

  const fetchFeedbacks = async () => {
    try {
      setLoadingFb(true);
      const res = await api.get(`/feedback/event/${eventId}`);
      setFeedbacks(res.data.feedbacks || []);
    } catch { } finally { setLoadingFb(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating)        { toast.error("Please select a rating."); return; }
    if (!comment.trim()){ toast.error("Please write a comment."); return; }
    try {
      setSubmitting(true);
      if (existingFeedback?._id) {
        await api.put(`/feedback/${existingFeedback._id}`, { rating, comment });
        toast.success("Review updated!");
      } else {
        await api.post("/feedback", { eventId, rating, comment });
        toast.success("Review submitted!");
      }
      setSubmitted(true); setEditMode(false);
      fetchFeedbacks();
    } catch (err) { toast.error(err.response?.data?.message || "Failed to submit."); }
    finally { setSubmitting(false); }
  };

  const handleLike = async (id) => {
    if (!currentUser) { toast.error("Please login."); return; }
    const uid = currentUser.id || currentUser._id;
    try {
      await api.post(`/feedback/${id}/like`);
      setFeedbacks((prev) => prev.map((f) => f._id!==id ? f : {
        ...f,
        likes:    f.likes?.includes(uid) ? f.likes.filter((l)=>l!==uid) : [...(f.likes||[]),uid],
        dislikes: (f.dislikes||[]).filter((d)=>d!==uid),
      }));
    } catch { }
  };

  const handleDislike = async (id) => {
    if (!currentUser) { toast.error("Please login."); return; }
    const uid = currentUser.id || currentUser._id;
    try {
      await api.post(`/feedback/${id}/dislike`);
      setFeedbacks((prev) => prev.map((f) => f._id!==id ? f : {
        ...f,
        dislikes: f.dislikes?.includes(uid) ? f.dislikes.filter((d)=>d!==uid) : [...(f.dislikes||[]),uid],
        likes:    (f.likes||[]).filter((l)=>l!==uid),
      }));
    } catch { }
  };

  const handleReply = async (parentId, text) => {
    try {
      await api.post(`/feedback/${parentId}/reply`, { comment: text });
      fetchFeedbacks();
    } catch (err) { toast.error("Failed to reply."); throw err; }
  };

  const ratedFbs  = feedbacks.filter((f)=>f.rating>0);
  const avgRating = ratedFbs.length>0 ? (ratedFbs.reduce((s,f)=>s+f.rating,0)/ratedFbs.length).toFixed(1) : null;
  const sorted    = [...feedbacks].sort((a,b)=>{
    if (sortBy==="top_rated")  return (b.rating||0)-(a.rating||0);
    if (sortBy==="most_liked") return (b.likes?.length||0)-(a.likes?.length||0);
    return new Date(b.createdAt)-new Date(a.createdAt);
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/student/registrations" className="inline-flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-800 font-semibold">
            <FaArrowLeft /> Back to My Registrations
          </Link>

          {/* Event bar */}
          {event && (
            <div className="bg-white rounded-2xl p-5 shadow border border-slate-100 mb-6 flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl flex-shrink-0">
                <FaCalendarAlt />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-black text-xl text-slate-900 truncate">{event.title}</h2>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                  {event.start_date && <span className="flex items-center gap-1"><FaCalendarAlt className="text-indigo-400"/>{new Date(event.start_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>}
                  {event.location   && <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-pink-400"/>{event.location}</span>}
                </div>
              </div>
              {avgRating && (
                <div className="flex flex-col items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-2xl flex-shrink-0">
                  <span className="text-2xl font-black text-yellow-600">{avgRating}</span>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map((s)=><FaStar key={s} className={`text-xs ${s<=Math.round(avgRating)?"text-yellow-400":"text-slate-200"}`}/>)}</div>
                  <span className="text-xs text-yellow-600 font-semibold">{ratedFbs.length} reviews</span>
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-5 gap-6">
            {/* Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-3xl p-6 shadow border border-slate-100 sticky top-6">
                <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2"><FaStar className="text-yellow-400"/> Your Review</h3>
                <p className="text-slate-500 text-sm mb-5">Share your experience</p>

                {submitted && !editMode ? (
                  <div>
                    <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map((s)=><FaStar key={s} className={`text-xl ${s<=rating?"text-yellow-400":"text-slate-200"}`}/>)}</div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
                      <p className="text-slate-700 text-sm leading-relaxed">"{comment}"</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-2xl mb-4 text-sm font-bold">
                      <FaCheckCircle /> Review submitted!
                    </div>
                    <button onClick={()=>setEditMode(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-indigo-200 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all text-sm">
                      <FaEdit /> Edit Review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Rating *</label>
                      <StarPicker value={rating} onChange={setRating} />
                      {rating>0 && <p className="text-sm font-bold text-yellow-600 mt-2">{RATING_LABEL[rating]}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Your Review *</label>
                      <textarea rows={5} value={comment} onChange={(e)=>setComment(e.target.value)}
                        placeholder="What did you enjoy? What could be improved?"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-none transition-all"/>
                      <div className="text-right text-xs text-slate-400 mt-1">{comment.length}/500</div>
                    </div>
                    <div className="flex gap-3">
                      {editMode && submitted && (
                        <button type="button" onClick={()=>setEditMode(false)} className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm">Cancel</button>
                      )}
                      <button type="submit" disabled={submitting||rating===0}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all text-sm">
                        {submitting?<FaSpinner className="animate-spin"/>:<FaStar/>}
                        {submitting?"Submitting...":(submitted?"Update":"Submit Review")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* All reviews */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <FaCommentAlt className="text-indigo-500"/> All Reviews
                  <span className="text-base font-bold text-slate-400">({feedbacks.length})</span>
                </h3>
                <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white focus:ring-2 focus:ring-indigo-100 outline-none">
                  <option value="newest">Newest First</option>
                  <option value="top_rated">Top Rated</option>
                  <option value="most_liked">Most Liked</option>
                </select>
              </div>

              {loadingFb ? (
                <div className="space-y-4">{[1,2,3].map((i)=><div key={i} className="h-24 bg-white rounded-2xl animate-pulse shadow"/>)}</div>
              ) : sorted.length===0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow border border-slate-100">
                  <FaCommentAlt className="text-6xl text-slate-200 mx-auto mb-4"/>
                  <p className="text-slate-500 font-bold text-lg">No reviews yet</p>
                  <p className="text-slate-400 text-sm mt-1">Be the first to share your experience!</p>
                </div>
              ) : (
                sorted.map((fb)=>(
                  <ReviewCard key={fb._id} fb={fb} onLike={handleLike} onDislike={handleDislike} onReply={handleReply} currentUser={currentUser}/>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventFeedback;