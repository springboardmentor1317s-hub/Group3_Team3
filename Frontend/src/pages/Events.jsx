import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaSearch,
  FaFilter, FaTag, FaClock, FaRupeeSign, FaTh,
  FaList, FaChevronDown, FaTimes,
} from "react-icons/fa";

const CATEGORIES = ["sports","hackathon","cultural","workshop","seminar","technical","social","other"];
const STATUSES = ["published","draft","completed","cancelled"];

const categoryColors = {
  sports:    { bg: "bg-green-100",  text: "text-green-800",  dot: "bg-green-500",  icon: "⚽" },
  hackathon: { bg: "bg-blue-100",   text: "text-blue-800",   dot: "bg-blue-500",   icon: "💻" },
  cultural:  { bg: "bg-purple-100", text: "text-purple-800", dot: "bg-purple-500", icon: "🎭" },
  workshop:  { bg: "bg-orange-100", text: "text-orange-800", dot: "bg-orange-500", icon: "🔧" },
  seminar:   { bg: "bg-red-100",    text: "text-red-800",    dot: "bg-red-500",    icon: "📚" },
  technical: { bg: "bg-indigo-100", text: "text-indigo-800", dot: "bg-indigo-500", icon: "⚡" },
  social:    { bg: "bg-pink-100",   text: "text-pink-800",   dot: "bg-pink-500",   icon: "🎉" },
  other:     { bg: "bg-gray-100",   text: "text-gray-800",   dot: "bg-gray-500",   icon: "📌" },
};

function SeatBar({ current, max }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const isFull = current >= max;
  const isAlmostFull = pct >= 80;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className={`font-bold ${isFull ? "text-red-600" : isAlmostFull ? "text-orange-600" : "text-slate-600"}`}>
          {isFull ? "🔴 Full" : isAlmostFull ? `🟠 ${max - current} spots left!` : `${current} registered`}
        </span>
        <span className="text-slate-400">{max} max</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isFull ? "bg-red-500" : isAlmostFull ? "bg-orange-500" : "bg-gradient-to-r from-indigo-500 to-purple-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EventCard({ event, view }) {
  const cat = categoryColors[event.category] || categoryColors.other;
  const isFull = event.current_participants >= event.max_participants;
  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  if (view === "list") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-5 flex items-center gap-6">
        <div className={`w-14 h-14 ${cat.bg} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>
          {cat.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-black text-slate-900 text-base truncate">{event.title}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>{event.category}</span>
            {isFull && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Full</span>}
          </div>
          <p className="text-slate-500 text-sm truncate mb-2">{event.description}</p>
          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1"><FaCalendarAlt />{formatDate(event.start_date)}</span>
            <span className="flex items-center gap-1"><FaMapMarkerAlt />{event.location}</span>
            <span className="flex items-center gap-1"><FaUsers />{event.current_participants || 0}/{event.max_participants}</span>
            {event.registration_fee > 0 && <span className="flex items-center gap-1"><FaRupeeSign />₹{event.registration_fee}</span>}
          </div>
        </div>
        <Link to={`/events/${event._id}`}
          className="flex-shrink-0 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors no-underline">
          View →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group">
      {/* Color header */}
      <div className={`h-3 bg-gradient-to-r ${
        event.category === "hackathon" ? "from-blue-500 to-cyan-500" :
        event.category === "cultural" ? "from-purple-500 to-pink-500" :
        event.category === "sports" ? "from-green-500 to-emerald-500" :
        event.category === "workshop" ? "from-orange-500 to-amber-500" :
        event.category === "seminar" ? "from-red-500 to-rose-500" :
        event.category === "technical" ? "from-indigo-500 to-violet-500" :
        "from-slate-400 to-slate-500"
      }`} />

      <div className="p-6">
        {/* Category + status */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${cat.bg} ${cat.text}`}>
            <span>{cat.icon}</span>{event.category}
          </span>
          {event.status && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              event.status === "published" ? "bg-emerald-100 text-emerald-700" :
              event.status === "completed" ? "bg-slate-100 text-slate-600" :
              "bg-yellow-100 text-yellow-700"
            }`}>{event.status}</span>
          )}
        </div>

        <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {event.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{event.description}</p>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <FaCalendarAlt className="text-indigo-400 flex-shrink-0" />
            <span className="truncate">{formatDate(event.start_date)}{event.end_date && event.end_date !== event.start_date ? ` – ${formatDate(event.end_date)}` : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FaMapMarkerAlt className="text-indigo-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.registration_fee > 0 && (
            <div className="flex items-center gap-2 text-slate-600">
              <FaRupeeSign className="text-indigo-400 flex-shrink-0" />
              <span>₹{event.registration_fee} registration fee</span>
            </div>
          )}
        </div>

        <SeatBar current={event.current_participants || 0} max={event.max_participants} />

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
          <span className="text-xs text-slate-400 truncate max-w-[120px]">{event.organizer || "Campus Event"}</span>
          <Link to={`/events/${event._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-100 transition-colors no-underline group-hover:bg-indigo-600 group-hover:text-white">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data.events || []);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.title?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q);
    const matchCat = !category || e.category?.toLowerCase() === category;
    const matchStatus = !status || e.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  const activeFilterCount = [category, status].filter(Boolean).length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

        {/* Page header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black mb-2">All Events</h1>
                <p className="text-indigo-200">Discover and register for exciting inter-college events</p>
              </div>
              <div className="text-indigo-200 text-sm font-bold bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                {filtered.length} events found
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Search + Filter bar */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 mb-8 flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search events, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>

            {/* Category */}
            <div className="relative">
              <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="pl-8 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white appearance-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none cursor-pointer font-medium text-slate-700">
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
            </div>

            {/* Status */}
            <div className="relative">
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="pl-4 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-white appearance-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none cursor-pointer font-medium text-slate-700">
                <option value="">All Status</option>
                {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
            </div>

            {/* Clear filters */}
            {(category || status || search) && (
              <button onClick={() => { setCategory(""); setStatus(""); setSearch(""); }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                <FaTimes className="text-xs" /> Clear
              </button>
            )}

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl ml-auto">
              <button onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white shadow text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}>
                <FaTh className="text-sm" />
              </button>
              <button onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white shadow text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}>
                <FaList className="text-sm" />
              </button>
            </div>
          </div>

          {/* Category quick-filter chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!category ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"}`}>
              All
            </button>
            {CATEGORIES.map((c) => {
              const col = categoryColors[c];
              return (
                <button key={c} onClick={() => setCategory(category === c ? "" : c)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${category === c ? `${col.dot} bg-opacity-100 text-white shadow-md` : `bg-white text-slate-600 border border-slate-200 hover:border-indigo-300`}`}
                  style={category === c ? {} : {}}>
                  <span>{col.icon}</span> {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Results */}
          {loading ? (
            <div className={`${view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                  <div className="h-3 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-200 rounded-full w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-3xl mb-5">🔍</div>
              <h3 className="text-xl font-black text-slate-800 mb-2">No events found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your search or filters</p>
              <button onClick={() => { setSearch(""); setCategory(""); setStatus(""); }}
                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filtered.map((event) => (
                <EventCard key={event._id} event={event} view={view} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Events;