import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

// --- Helper Components & Functions ---

const categoryColors = {
  sports: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  tech: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  arts: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  default: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
};

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1">
      <span className="text-2xl">{icon}</span>
      <span className="text-white/40 text-xs uppercase tracking-widest font-medium">{label}</span>
      <span className="text-white font-semibold text-lg leading-tight">{value}</span>
    </div>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${className}`}>
      {children}
    </span>
  );
}

// --- Main Component ---

export default function EventDetailsPage() {
  const { id } = useParams(); // Grabs the ID from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI States
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [registered, setRegistered] = useState(false);

 useEffect(() => {
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await api.get(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Based on your log: response.data.event contains the object
      const data = response.data.event;
      
      if (data) {
        setEvent(data);
        setLikeCount(data.likes || 0);
      }
      
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Could not load event details.");
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchEventDetails();
}, [id]);

    

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    // Optional: Add api.post(`/events/${id}/like`) here
  };

  const handleRegister = () => {
    setRegistered((prev) => !prev);
    // Optional: Add api.post(`/events/${id}/register`) here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-white/50 animate-pulse">Loading Event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-4xl mb-4">⚠️</h1>
          <p className="text-white/60 mb-6">{error || "Event not found."}</p>
          <Link to="/events" className="text-orange-400 hover:underline">Back to Events</Link>
        </div>
      </div>
    );
  }

  const catStyle = categoryColors[event.category] || categoryColors.default;
  const participantPct = event.max_participants > 0
    ? Math.round((event.current_participants / event.max_participants) * 100)
    : 0;

  return (
    <div
      className="min-h-screen text-white pb-20"
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0f0a 100%)",
        fontFamily: "'Georgia', serif",
      }}
    >
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #f97316, #fb923c, #fdba74, #f97316)" }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 mb-8 text-white/40 text-sm">
          <Link to="/events" className="hover:text-white transition-colors">Events</Link>
          <span>/</span>
          <span className="capitalize">{event.category}</span>
          <span>/</span>
          <span className="text-white/70 truncate max-w-xs">{event.title}</span>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl" style={{ minHeight: "280px" }}>
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-80 object-cover" />
          ) : (
            <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
              <div className="text-center select-none">
                <div className="text-8xl opacity-20 mb-2">🏆</div>
                <p className="text-white/20 text-sm tracking-widest uppercase font-sans">No Image Preview</p>
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge className={`${catStyle.bg} ${catStyle.text} ${catStyle.border} backdrop-blur-md`}>
              ● {event.category}
            </Badge>
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md capitalize font-sans">
              {event.event_type}
            </Badge>
            {event.is_featured && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 backdrop-blur-md">
                ⭐ Featured
              </Badge>
            )}
          </div>

          <div className="absolute top-4 right-4">
            <Badge className={`${event.status === "published" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-red-500/20 text-red-300 border-red-400/30"} backdrop-blur-md capitalize`}>
              {event.status}
            </Badge>
          </div>
        </div>

        {/* Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-2 tracking-tight">
              {event.title}
            </h1>
            <p className="text-white/50 text-sm font-sans">
              Organized by <span className="text-orange-400 font-medium">{event.organizer}</span>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0 font-sans">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                liked ? "bg-red-500/20 border-red-400/40 text-red-300" : "bg-white/5 border-white/15 text-white/60 hover:bg-white/10"
              }`}
            >
              {liked ? "❤️" : "🤍"} {likeCount}
            </button>
            <button
              onClick={handleRegister}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
                registered ? "bg-white/10 border border-white/20 text-white/60" : "text-white"
              }`}
              style={!registered ? { background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" } : {}}
            >
              {registered ? "✓ Registered" : "Register Now"}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 font-sans">
          <StatCard icon="👁️" label="Views" value={event.views} />
          <StatCard icon="❤️" label="Likes" value={likeCount} />
          <StatCard icon="💰" label="Fee" value={event.registration_fee === 0 ? "Free" : `₹${event.registration_fee}`} />
          <StatCard icon="🎓" label="Certificate" value={event.certificates ? "Yes" : "No"} />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          {/* Left: Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">About the Event</h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">{event.description || "No description provided."}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Eligibility</h2>
              <p className="text-white/80">{event.eligibility || "Open to all"}</p>
            </div>

            {event.requirements && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Requirements</h2>
                <p className="text-white/80">{event.requirements}</p>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Schedule</h2>
              {event.schedule?.length > 0 ? (
                <ul className="space-y-3">
                  {event.schedule.map((item, idx) => (
                    <li key={idx} className="text-white/70 flex gap-3 items-start">
                      <span className="text-orange-400 mt-1">◆</span> {item}
                    </li>
                  ))}
                </ul>
              ) : <p className="text-white/30 italic text-sm">Schedule not announced yet.</p>}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-5">
              <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold">Logistics</h2>
              
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-white font-medium text-sm">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Event Date</p>
                  <p className="text-white font-medium text-sm">
                    {formatDate(event.start_date)} - {formatDate(event.end_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">⏰</span>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Reg. Deadline</p>
                  <p className="text-orange-300 font-medium text-sm">{formatDateTime(event.registration_end)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Availability</h2>
              <div className="flex items-end justify-between mb-3">
                <span className="text-3xl font-bold text-white">{event.current_participants}</span>
                <span className="text-white/40 text-xs">/ {event.max_participants} slots</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 mb-3 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${participantPct}%`, background: "linear-gradient(90deg, #f97316, #fb923c)" }}
                />
              </div>
              <p className="text-white/40 text-[10px] uppercase tracking-tighter">
                {participantPct}% filled • {event.max_participants - event.current_participants} remaining
              </p>
            </div>

            {event.tags?.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h2 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, i) => (
                    <span key={i} className="bg-white/5 text-white/50 text-[10px] px-2 py-1 rounded-md border border-white/5 uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}