// src/pages/admin/FeedbackAnalytics.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import { toast } from "react-toastify";
import {
  FaStar, FaChartBar, FaCommentAlt, FaSearch, FaTrash,
  FaThumbsUp, FaThumbsDown, FaCalendarAlt, FaUsers,
  FaTrophy, FaExclamationTriangle, FaDownload, FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";

// ── helpers ───────────────────────────────────────────────────────────────────
const avColors = ["bg-indigo-500","bg-purple-500","bg-emerald-500","bg-pink-500","bg-orange-500","bg-teal-500"];
const avBg = (name="") => { let s=0; for(const c of name) s+=c.charCodeAt(0); return avColors[s%avColors.length]; };

function MiniStars({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s)=>(
        <FaStar key={s} className={`text-xs ${s<=Math.round(value)?"text-yellow-400":"text-slate-200"}`}/>
      ))}
    </div>
  );
}

function RatingBar({ star, count, total, color }) {
  const pct = total>0 ? Math.round((count/total)*100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-slate-500 font-bold w-10 flex-shrink-0">{star} ⭐</span>
      <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{width:`${pct}%`}}/>
      </div>
      <span className="text-slate-600 font-bold w-20 text-right flex-shrink-0">{count} ({pct}%)</span>
    </div>
  );
}

function timeAgo(date) {
  const d = Math.floor((Date.now()-new Date(date))/86400000);
  if (d<1) return "Today"; if(d===1) return "Yesterday"; return `${d}d ago`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
function FeedbackAnalytics() {
  const user = getUser();

  const [analysis,    setAnalysis]    = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState("overview");
  const [search,      setSearch]      = useState("");
  const [ratingFilter,setRatingFilter]= useState("all");
  const [sortBy,      setSortBy]      = useState("avg_desc");
  const [deletingId,  setDeletingId]  = useState(null);

  useEffect(()=>{ fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aRes, cRes] = await Promise.all([
        api.get("/feedback/admin/analysis"),
        api.get("/feedback/admin/all"),
      ]);
      setAnalysis(aRes.data);
      setAllComments(cRes.data.feedbacks || []);
    } catch(err) {
      console.error(err);
      toast.error("Failed to load feedback data");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      setDeletingId(id);
      await api.delete(`/feedback/${id}`);
      setAllComments((prev)=>prev.filter((c)=>c._id!==id));
      toast.success("Review deleted.");
    } catch { toast.error("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const exportCSV = () => {
    const events = analysis?.events || [];
    const csv = [
      ["Event","Avg Rating","Total Reviews","5★","4★","3★","2★","1★"],
      ...events.map((e)=>[
        e.title,
        e.avgRating?.toFixed(1)||"N/A",
        e.feedbackCount,
        e.ratingDistribution?.[5]||0,
        e.ratingDistribution?.[4]||0,
        e.ratingDistribution?.[3]||0,
        e.ratingDistribution?.[2]||0,
        e.ratingDistribution?.[1]||0,
      ])
    ].map((r)=>r.map((v)=>`"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download="feedback_analysis.csv"; a.click();
  };

  // ── derived ──────────────────────────────────────────────────────────────
  const events = analysis?.events || [];
  const globalStats = analysis?.globalStats || {};

  // Global rating distribution
  const globalDist = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  allComments.filter((c)=>c.rating>0).forEach((c)=>{ globalDist[c.rating]++; });
  const totalRated = Object.values(globalDist).reduce((a,b)=>a+b,0);

  const sortedEvents = [...events].sort((a,b)=>{
    if (sortBy==="avg_desc")   return (b.avgRating||0)-(a.avgRating||0);
    if (sortBy==="avg_asc")    return (a.avgRating||0)-(b.avgRating||0);
    if (sortBy==="count_desc") return (b.feedbackCount||0)-(a.feedbackCount||0);
    return 0;
  });

  const filteredComments = allComments.filter((c)=>{
    const ms = !search || c.student?.name?.toLowerCase().includes(search.toLowerCase()) || c.event?.title?.toLowerCase().includes(search.toLowerCase()) || c.comment?.toLowerCase().includes(search.toLowerCase());
    const mr = ratingFilter==="all" || String(c.rating)===ratingFilter;
    return ms && mr;
  });

  const rated     = events.filter((e)=>e.avgRating).sort((a,b)=>b.avgRating-a.avgRating);
  const topEvents = rated.slice(0,3);
  const lowEvents = rated.slice(-3).reverse();
  const lowRatings = allComments.filter((c)=>c.rating>0&&c.rating<=2);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"/>
            <p className="mt-4 text-gray-600">Loading feedback analysis...</p>
          </div>
        </div>
      </>
    );
  }

  const statCards = [
    { label:"Events Reviewed",  value:events.length,                    icon:<FaCalendarAlt/>, color:"from-indigo-500 to-purple-600" },
    { label:"Total Feedbacks",  value:globalStats.totalFeedbacks||0,    icon:<FaCommentAlt/>,  color:"from-emerald-500 to-teal-600"  },
    { label:"Platform Avg",     value:`⭐ ${globalStats.globalAvg||"0"}`,icon:<FaStar/>,        color:"from-yellow-400 to-orange-500" },
    { label:"Flagged Reviews",  value:lowRatings.length,                icon:<FaExclamationTriangle/>, color:"from-red-500 to-rose-600" },
  ];

  const tabs = [
    { id:"overview",   label:"Overview"     },
    { id:"events",     label:"By Event"     },
    { id:"reviews",    label:"All Reviews"  },
    { id:"moderation", label:"⚠️ Moderation"},
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                <FaArrowLeft className="text-slate-600"/>
              </Link>
              <div>
                <h1 className="text-3xl font-black text-slate-800">Feedback Analytics</h1>
                <p className="text-slate-500 mt-0.5">Monitor ratings, reviews and discussions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={fetchData} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow hover:shadow-md transition">
                🔄 Refresh
              </button>
              <button onClick={exportCSV} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition">
                <FaDownload /> Export CSV
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {statCards.map((s,i)=>(
              <div key={i} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-all`}>
                  {s.icon}
                </div>
                <p className="text-3xl font-black text-slate-900 mb-1">{s.value}</p>
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white/60 p-2 rounded-2xl shadow border border-slate-100 mb-8 overflow-x-auto w-fit">
            {tabs.map((t)=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab===t.id?"bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg":"text-slate-600 hover:bg-slate-100"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW ──────────────────────────────────────────────────── */}
          {activeTab==="overview" && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Rating distribution */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
                  <FaChartBar className="text-indigo-500"/> Rating Distribution
                </h3>
                <p className="text-slate-400 text-sm mb-6">{totalRated} total ratings</p>
                <div className="space-y-4">
                  {[5,4,3,2,1].map((s)=>(
                    <RatingBar key={s} star={s} count={globalDist[s]} total={totalRated}
                      color={s>=4?"bg-emerald-400":s===3?"bg-yellow-400":"bg-red-400"} />
                  ))}
                </div>
              </div>

              {/* Top + Low rated */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                  <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <FaTrophy className="text-yellow-500"/> Top Rated Events
                  </h3>
                  {topEvents.length===0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">No data yet</p>
                  ) : topEvents.map((e,i)=>(
                    <div key={e._id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black text-white ${i===0?"bg-yellow-400":i===1?"bg-slate-400":"bg-orange-400"}`}>{i+1}</span>
                        <div>
                          <div className="font-bold text-slate-800 text-sm truncate max-w-[160px]">{e.title}</div>
                          <div className="text-xs text-slate-400">{e.feedbackCount} reviews</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MiniStars value={e.avgRating}/>
                        <span className="font-black text-yellow-600 text-sm">{e.avgRating?.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                  <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-500"/> Needs Attention
                  </h3>
                  {lowEvents.length===0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">All events rated well! 🎉</p>
                  ) : lowEvents.map((e)=>(
                    <div key={e._id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                      <div>
                        <div className="font-bold text-slate-800 text-sm truncate max-w-[180px]">{e.title}</div>
                        <div className="text-xs text-slate-400">{e.feedbackCount} reviews</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MiniStars value={e.avgRating}/>
                        <span className="font-black text-red-500 text-sm">{e.avgRating?.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BY EVENT ──────────────────────────────────────────────────── */}
          {activeTab==="events" && (
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}
                  className="px-5 py-3 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 bg-white text-sm">
                  <option value="avg_desc">Highest Rated First</option>
                  <option value="avg_asc">Lowest Rated First</option>
                  <option value="count_desc">Most Reviewed First</option>
                </select>
              </div>

              {sortedEvents.length===0 ? (
                <div className="bg-white rounded-3xl p-14 text-center shadow">
                  <FaChartBar className="text-6xl text-slate-200 mx-auto mb-4"/>
                  <p className="text-slate-500 font-bold">No event feedback data yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {sortedEvents.map((event)=>{
                    const dist  = event.ratingDistribution || {};
                    const total = Object.values(dist).reduce((a,b)=>a+b,0);
                    return (
                      <div key={event._id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all">
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-slate-900 text-base truncate">{event.title}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{event.feedbackCount||0} reviews</p>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0">
                            <span className="text-2xl font-black text-yellow-500">{event.avgRating?.toFixed(1)||"—"}</span>
                            <MiniStars value={event.avgRating||0}/>
                          </div>
                        </div>
                        {total>0 && (
                          <div className="space-y-1.5 mt-4">
                            {[5,4,3,2,1].map((s)=>{
                              const cnt = dist[s]||0;
                              const pct = total>0 ? (cnt/total)*100 : 0;
                              return (
                                <div key={s} className="flex items-center gap-2 text-xs">
                                  <span className="text-slate-400 w-4 font-bold">{s}</span>
                                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                                    <div className={`h-full rounded-full transition-all duration-500 ${s>=4?"bg-emerald-400":s===3?"bg-yellow-400":"bg-red-400"}`} style={{width:`${pct}%`}}/>
                                  </div>
                                  <span className="text-slate-400 w-4 text-right">{cnt}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <button onClick={()=>{setActiveTab("reviews");setSearch(event.title);}}
                          className="mt-5 w-full py-2.5 text-sm font-bold text-indigo-600 border-2 border-indigo-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                          View Reviews →
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── ALL REVIEWS ───────────────────────────────────────────────── */}
          {activeTab==="reviews" && (
            <div>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative flex-1 min-w-60">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input type="text" placeholder="Search by student, event, or text..."
                    value={search} onChange={(e)=>setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none shadow-sm"/>
                </div>
                <select value={ratingFilter} onChange={(e)=>setRatingFilter(e.target.value)}
                  className="px-5 py-3 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 bg-white text-sm">
                  <option value="all">All Ratings</option>
                  {[5,4,3,2,1].map((s)=><option key={s} value={String(s)}>{s} ⭐</option>)}
                </select>
              </div>
              <p className="text-sm text-slate-500 mb-4 font-semibold">Showing {filteredComments.length} of {allComments.length} reviews</p>

              {filteredComments.length===0 ? (
                <div className="bg-white rounded-3xl p-14 text-center shadow">
                  <FaCommentAlt className="text-6xl text-slate-200 mx-auto mb-4"/>
                  <p className="text-slate-500 font-bold">No reviews found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComments.map((fb)=>(
                    <div key={fb._id} className="bg-white rounded-3xl shadow border border-slate-100 p-6 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${avBg(fb.student?.name)} rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}>
                            {fb.student?.name?.[0]?.toUpperCase()||"?"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{fb.student?.name||"Anonymous"}</div>
                            <div className="text-xs text-slate-400">{fb.student?.college} · {timeAgo(fb.createdAt)}</div>
                          </div>
                        </div>
                        {fb.rating>0 && (
                          <div className="flex items-center gap-1.5">
                            <MiniStars value={fb.rating}/>
                            <span className="font-black text-yellow-600 text-sm">{fb.rating}/5</span>
                          </div>
                        )}
                      </div>
                      {fb.event?.title && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
                          <FaCalendarAlt className="text-indigo-400"/> {fb.event.title}
                        </div>
                      )}
                      <p className="text-slate-700 text-sm leading-relaxed mt-3">{fb.comment}</p>
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-50 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><FaThumbsUp className="text-indigo-400"/> {fb.likes?.length||0}</span>
                        <span className="flex items-center gap-1.5"><FaThumbsDown className="text-red-400"/> {fb.dislikes?.length||0}</span>
                        {fb.replies?.length>0 && <span className="flex items-center gap-1.5"><FaCommentAlt className="text-emerald-400"/> {fb.replies.length} replies</span>}
                        <button onClick={()=>handleDelete(fb._id)} disabled={deletingId===fb._id}
                          className="flex items-center gap-1.5 ml-auto text-slate-300 hover:text-red-500 font-bold px-3 py-1.5 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50">
                          {deletingId===fb._id?<FaSpinner className="animate-spin"/>:<FaTrash/>} Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MODERATION ────────────────────────────────────────────────── */}
          {activeTab==="moderation" && (
            <div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
                <FaExclamationTriangle className="text-amber-500 text-xl flex-shrink-0 mt-0.5"/>
                <div>
                  <div className="font-bold text-amber-800 text-sm">Moderation Panel</div>
                  <div className="text-amber-700 text-xs mt-0.5">Delete inappropriate reviews. This action is permanent.</div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
                <FaExclamationTriangle className="text-red-500"/> Flagged Reviews (≤ 2 ⭐)
                <span className="text-base font-bold text-red-400">({lowRatings.length})</span>
              </h3>

              {lowRatings.length===0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow mb-8">
                  <p className="text-slate-500 font-bold">No low-rated reviews — great job! 🎉</p>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {lowRatings.map((fb)=>(
                    <div key={fb._id} className={`bg-white rounded-3xl shadow border ${fb.rating<=2?"border-red-100":"border-slate-100"} p-5 hover:shadow-xl transition-all`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${avBg(fb.student?.name)} rounded-full flex items-center justify-center font-bold text-white text-sm`}>
                            {fb.student?.name?.[0]?.toUpperCase()||"?"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{fb.student?.name||"Anonymous"}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-black px-2 py-0.5 bg-red-100 text-red-700 rounded-lg">{fb.rating} ⭐</span>
                              {fb.event?.title && <span className="text-xs text-slate-400 truncate max-w-[180px]">{fb.event.title}</span>}
                            </div>
                          </div>
                        </div>
                        <button onClick={()=>handleDelete(fb._id)} disabled={deletingId===fb._id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-xs transition-all hover:-translate-y-0.5 disabled:opacity-50 flex-shrink-0">
                          {deletingId===fb._id?<FaSpinner className="animate-spin"/>:<FaTrash/>} Delete
                        </button>
                      </div>
                      <p className="text-slate-600 text-sm mt-3 leading-relaxed">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-4">
                <FaCommentAlt className="text-slate-500"/> All Reviews
              </h3>
              <div className="space-y-3">
                {allComments.map((fb)=>(
                  <div key={fb._id} className="bg-white rounded-2xl shadow border border-slate-100 p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-9 h-9 ${avBg(fb.student?.name)} rounded-xl flex items-center justify-center font-bold text-white text-xs flex-shrink-0`}>
                        {fb.student?.name?.[0]?.toUpperCase()||"?"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800 text-sm">{fb.student?.name||"Anonymous"}</span>
                          {fb.rating>0 && <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${fb.rating<=2?"bg-red-100 text-red-700":fb.rating===3?"bg-yellow-100 text-yellow-700":"bg-green-100 text-green-700"}`}>{fb.rating} ⭐</span>}
                          {fb.event?.title && <span className="text-xs text-slate-400 truncate">· {fb.event.title}</span>}
                        </div>
                        <p className="text-slate-500 text-xs mt-0.5 truncate">{fb.comment}</p>
                      </div>
                    </div>
                    <button onClick={()=>handleDelete(fb._id)} disabled={deletingId===fb._id}
                      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-all disabled:opacity-50">
                      {deletingId===fb._id?<FaSpinner className="animate-spin"/>:<FaTrash/>} Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default FeedbackAnalytics;