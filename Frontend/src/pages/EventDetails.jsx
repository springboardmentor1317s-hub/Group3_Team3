// src/pages/event/EventDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import EventComments from "./components/EventComments";
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaRupeeSign,
  FaTag, FaArrowLeft, FaStar, FaCheckCircle,
  FaThumbsUp, FaThumbsDown, FaUserShield,
} from "react-icons/fa";

// ── helpers ───────────────────────────────────────────────────────────────────
const COLORS = ["bg-indigo-500","bg-purple-500","bg-emerald-500","bg-pink-500","bg-orange-500","bg-teal-500"];
const avBg   = (name="") => { let s=0; for(const c of name) s+=c.charCodeAt(0); return COLORS[s%COLORS.length]; };

function timeAgo(date) {
  const d = Math.floor((Date.now()-new Date(date))/86400000);
  if(d<1) return "Today"; if(d===1) return "Yesterday"; return `${d}d ago`;
}

function Stars({ value, size="text-sm" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s)=>(
        <FaStar key={s} className={`${size} ${s<=Math.round(value)?"text-yellow-400":"text-gray-200"}`}/>
      ))}
    </div>
  );
}

// ── Feedback Card (admin view only) ──────────────────────────────────────────
function FeedbackCard({ fb, currentUserId }) {
  const [liked,    setLiked]    = useState(fb.likes?.includes(currentUserId));
  const [disliked, setDisliked] = useState(fb.dislikes?.includes(currentUserId));
  const [likes,    setLikes]    = useState(fb.likes?.length    || 0);
  const [dislikes, setDislikes] = useState(fb.dislikes?.length || 0);

  const handleLike = async () => {
    try {
      await api.post(`/feedback/${fb._id}/like`);
      if (liked) { setLikes(l=>l-1); setLiked(false); }
      else { setLikes(l=>l+1); setLiked(true); if(disliked){ setDislikes(d=>d-1); setDisliked(false); } }
    } catch { /* silent */ }
  };

  const handleDislike = async () => {
    try {
      await api.post(`/feedback/${fb._id}/dislike`);
      if (disliked) { setDislikes(d=>d-1); setDisliked(false); }
      else { setDislikes(d=>d+1); setDisliked(true); if(liked){ setLikes(l=>l-1); setLiked(false); } }
    } catch { /* silent */ }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${avBg(fb.student?.name)} rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}>
            {fb.student?.name?.[0]?.toUpperCase()||"?"}
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">{fb.student?.name||"Anonymous"}</div>
            <div className="text-xs text-gray-400">{fb.student?.college} · {timeAgo(fb.createdAt)}</div>
          </div>
        </div>
        {fb.rating>0 && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Stars value={fb.rating}/>
            <span className="text-sm font-bold text-yellow-500">{fb.rating}/5</span>
          </div>
        )}
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">{fb.comment}</p>

      <div className="flex items-center gap-3 text-xs border-t border-gray-50 pt-3">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${liked?"bg-indigo-100 text-indigo-700":"text-gray-400 hover:bg-gray-100"}`}>
          <FaThumbsUp/> {likes}
        </button>
        <button onClick={handleDislike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${disliked?"bg-red-100 text-red-700":"text-gray-400 hover:bg-gray-100"}`}>
          <FaThumbsDown/> {dislikes}
        </button>
      </div>
    </div>
  );
}

function RatingBar({ star, count, total }) {
  const pct = total>0 ? Math.round((count/total)*100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 font-semibold w-6">{star}★</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`h-full rounded-full transition-all ${star>=4?"bg-emerald-400":star===3?"bg-yellow-400":"bg-red-400"}`}
          style={{width:`${pct}%`}}/>
      </div>
      <span className="text-gray-400 w-6 text-right">{count}</span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
function EventDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [event,        setEvent]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [registering,  setRegistering]  = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [myFeedback,   setMyFeedback]   = useState(null);

  // Feedback (admin view only)
  const [feedbacks,  setFeedbacks]  = useState([]);
  const [avgRating,  setAvgRating]  = useState(null);
  const [loadingFb,  setLoadingFb]  = useState(false);
  const [fbSortBy,   setFbSortBy]   = useState("newest");

  const user      = JSON.parse(localStorage.getItem("user")) || null;
  const token     = localStorage.getItem("token");
  const isStudent = user?.role === "student";
  const isAdmin   = user?.role === "college_admin" || user?.role === "super_admin";

  useEffect(() => {
    fetchEvent();
    if (token) checkRegistrationStatus();
    // Fetch my feedback only for students (for CTA)
    if (token && isStudent) fetchMyFeedback();
    // Fetch all feedbacks only for admins
    if (token && isAdmin) fetchFeedbacks();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.event || res.data);
    } catch {
      toast.error("Failed to load event details");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoadingFb(true);
      const res = await api.get(`/feedback/event/${id}`);
      setFeedbacks(res.data.feedbacks || []);
      setAvgRating(res.data.avgRating || null);
    } catch { /* silent */ }
    finally { setLoadingFb(false); }
  };

  const checkRegistrationStatus = async () => {
    try {
      const res  = await api.get("/registrations/my");
      const regs = res.data.registrations || res.data || [];
      setIsRegistered(regs.some((r) => r.event_id?._id===id || r.event_id===id));
    } catch { /* silent */ }
  };

  const fetchMyFeedback = async () => {
    try {
      const res   = await api.get("/feedback/my");
      const found = (res.data.feedbacks||[]).find((f) => f.event?._id===id || f.event===id);
      if (found) setMyFeedback(found);
    } catch { /* silent */ }
  };

  const handleRegister = async () => {
    if (!token) { toast.error("Please login to register"); navigate("/login"); return; }
    setRegistering(true);
    try {
      await api.post("/registrations/register", { event_id: id });
      toast.success("Registered successfully! Awaiting admin approval.");
      setIsRegistered(true);
      fetchEvent();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register");
    } finally { setRegistering(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", {
    year:"numeric", month:"long", day:"numeric", weekday:"long",
  });

  const getCategoryColor = (cat) => {
    const m = { sports:"bg-green-100 text-green-800", hackathon:"bg-blue-100 text-blue-800", cultural:"bg-purple-100 text-purple-800", workshop:"bg-orange-100 text-orange-800", seminar:"bg-red-100 text-red-800", technical:"bg-indigo-100 text-indigo-800", social:"bg-pink-100 text-pink-800", other:"bg-gray-100 text-gray-800" };
    return m[cat] || m.other;
  };

  const isEventCompleted = event && new Date(event.end_date) < new Date();
  const isFull           = event && event.current_participants >= event.max_participants;
  const canFeedback      = isStudent && isRegistered && isEventCompleted;

  // Sorted feedbacks for admin
  const sortedFbs = [...feedbacks].sort((a,b)=>{
    if(fbSortBy==="top_rated")  return (b.rating||0)-(a.rating||0);
    if(fbSortBy==="most_liked") return (b.likes?.length||0)-(a.likes?.length||0);
    return new Date(b.createdAt)-new Date(a.createdAt);
  });

  const dist = {1:0,2:0,3:0,4:0,5:0};
  feedbacks.filter((f)=>f.rating>0).forEach((f)=>{ if(f.rating>=1&&f.rating<=5) dist[f.rating]++; });
  const totalRated = Object.values(dist).reduce((a,b)=>a+b,0);

  if (loading) {
    return (
      <>
        <Navbar/>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"/>
            <p className="mt-4 text-gray-600">Loading event details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!event) return null;

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Link to="/events" className="inline-flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-700 font-semibold">
            <FaArrowLeft/> Back to Events
          </Link>

          {/* ── Main Card ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {event.image && <img src={event.image} alt={event.title} className="w-full h-56 object-cover"/>}
            <div className="p-8">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{event.title}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(event.category)}`}>
                      <FaTag className="text-xs"/> {event.category}
                    </span>
                    {event.status && (
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${event.status==="published"?"bg-green-100 text-green-700":event.status==="completed"?"bg-slate-100 text-slate-600":"bg-yellow-100 text-yellow-700"}`}>
                        {event.status}
                      </span>
                    )}
                    {/* Admin-only: avg rating badge in title area */}
                    {isAdmin && avgRating && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full text-xs font-bold text-yellow-700">
                        <FaStar className="text-yellow-400"/> {avgRating} ({totalRated} reviews)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-8">{event.description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-700">
                    <FaCalendarAlt className="text-indigo-600 mt-1 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm text-gray-600">{formatDate(event.start_date)}</p>
                      {event.end_date && event.end_date!==event.start_date && (
                        <p className="text-sm text-gray-600">to {formatDate(event.end_date)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <FaMapMarkerAlt className="text-indigo-600 mt-1 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-700">
                    <FaUsers className="text-indigo-600 mt-1 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-sm text-gray-600">
                        {event.current_participants||0} / {event.max_participants} registered
                      </p>
                      {isFull && <p className="text-xs text-red-500 font-semibold mt-1">Event is full</p>}
                    </div>
                  </div>
                  {event.registration_fee>0 && (
                    <div className="flex items-start gap-3 text-gray-700">
                      <FaRupeeSign className="text-indigo-600 mt-1 flex-shrink-0"/>
                      <div>
                        <p className="font-medium">Registration Fee</p>
                        <p className="text-sm text-gray-600">₹{event.registration_fee}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Register / Registered */}
              <div className="border-t pt-6">
                {isRegistered ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex flex-wrap items-center gap-4">
                    <FaUsers className="text-green-500 text-2xl flex-shrink-0"/>
                    <div className="flex-1">
                      <p className="font-bold text-green-800">You're registered for this event!</p>
                      <p className="text-sm text-green-700 mt-0.5">Check your notifications for approval status.</p>
                    </div>
                    {/* Feedback CTA — students only, after event ends */}
                    {canFeedback && (
                      myFeedback ? (
                        <Link to={`/student/feedback/${id}`} state={{ existingFeedback:myFeedback, event }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-xl text-sm transition-all shadow-sm flex-shrink-0">
                          <FaStar/> Edit Review
                        </Link>
                      ) : (
                        <Link to={`/student/feedback/${id}`} state={{ event }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm flex-shrink-0">
                          <FaStar/> Give Feedback
                        </Link>
                      )
                    )}
                    {isStudent && isRegistered && !isEventCompleted && (
                      <span className="text-xs text-gray-400 italic">Feedback available after event ends</span>
                    )}
                  </div>
                ) : !isAdmin ? (
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Register for this event</h3>
                      {isFull && <p className="text-sm text-red-500">This event is full</p>}
                      {isEventCompleted && <p className="text-sm text-gray-500">This event has ended</p>}
                    </div>
                    <button onClick={handleRegister} disabled={isFull||registering||isEventCompleted}
                      className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                      {registering ? "Registering..." : "Register Now"}
                    </button>
                  </div>
                ) : null}

                {/* My feedback preview */}
                {myFeedback && (
                  <div className="mt-4 flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3">
                    <Stars value={myFeedback.rating}/>
                    <span className="text-sm text-yellow-700 font-medium flex-1">
                      Your review: "{myFeedback.comment?.slice(0,80)}{myFeedback.comment?.length>80?"…":""}"
                    </span>
                    <FaCheckCircle className="text-yellow-500 flex-shrink-0"/>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Extra info */}
          {event.requirements && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
              <p className="text-gray-600">{event.requirements}</p>
            </div>
          )}
          {event.eligibility && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Eligibility</h3>
              <p className="text-gray-600">{event.eligibility}</p>
            </div>
          )}
          {event.rules_and_regulations && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Rules & Regulations</h3>
              <p className="text-gray-600 whitespace-pre-line">{event.rules_and_regulations}</p>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* ADMIN ONLY — Student Feedback Section                      */}
          {/* ══════════════════════════════════════════════════════════ */}
          {isAdmin && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              {/* Admin notice */}
              <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-5">
                <FaUserShield className="text-indigo-500 flex-shrink-0"/>
                <p className="text-sm font-semibold text-indigo-700">
                  Admin View — Student feedback submitted for this event
                </p>
              </div>

              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaStar className="text-yellow-400"/>
                  Student Feedback
                  <span className="text-base font-semibold text-gray-400">({feedbacks.length})</span>
                </h3>
                {feedbacks.length>1 && (
                  <select value={fbSortBy} onChange={(e)=>setFbSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100">
                    <option value="newest">Newest First</option>
                    <option value="top_rated">Top Rated</option>
                    <option value="most_liked">Most Liked</option>
                  </select>
                )}
              </div>

              {/* Rating summary */}
              {avgRating && totalRated>0 && (
                <div className="flex flex-col sm:flex-row items-start gap-6 mb-5 p-5 bg-gray-50 rounded-xl">
                  <div className="flex flex-col items-center px-6 py-2 flex-shrink-0">
                    <div className="text-5xl font-black text-gray-900">{avgRating}</div>
                    <Stars value={parseFloat(avgRating)} size="text-xl"/>
                    <div className="text-xs text-gray-400 mt-1 font-medium">{totalRated} review{totalRated!==1?"s":""}</div>
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    {[5,4,3,2,1].map((s)=>(
                      <RatingBar key={s} star={s} count={dist[s]} total={totalRated}/>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback cards */}
              {loadingFb ? (
                <div className="space-y-3">
                  {[1,2].map((i)=><div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"/>)}
                </div>
              ) : sortedFbs.length===0 ? (
                <div className="text-center py-10 text-gray-400">
                  <FaStar className="text-5xl mx-auto mb-3 opacity-20"/>
                  <p className="font-semibold text-gray-500">No student feedback yet for this event</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {sortedFbs.map((fb)=>(
                    <FeedbackCard key={fb._id} fb={fb} currentUserId={user?.id||user?._id}/>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* COMMENTS — shown to EVERYONE (students + admins)           */}
          {/* ══════════════════════════════════════════════════════════ */}
          <EventComments eventId={id}/>

        </div>
      </div>
    </>
  );
}

export default EventDetails;