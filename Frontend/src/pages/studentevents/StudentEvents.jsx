import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaTimes,
  FaChevronDown,
  FaTicketAlt,
  FaSortAmountDown,
} from "react-icons/fa";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const CATEGORIES = [
  "all",
  "sports",
  "hackathon",
  "cultural",
  "workshop",
  "seminar",
  "social",
  "technical",
  "other",
];
const STATUSES = ["all", "published", "ongoing", "completed"];
const EVENT_TYPES = ["all", "offline", "online", "hybrid"];
const DATE_FILTERS = [
  { label: "All Dates", value: "" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];
const FEE_FILTERS = [
  { label: "Any Fee", value: "all" },
  { label: "Free Only", value: "free" },
  { label: "Paid Only", value: "paid" },
];
const SORT_OPTIONS = [
  { label: "Date (Newest)", value: "date_asc" },
  { label: "Date (Latest)", value: "date_desc" },
  { label: "Name A→Z", value: "name_asc" },
  { label: "Most Participants", value: "participants" },
];

const CATEGORY_GRADIENT = {
  hackathon: "from-blue-500 to-indigo-600",
  cultural: "from-pink-500 to-purple-600",
  sports: "from-green-500 to-emerald-600",
  workshop: "from-yellow-500 to-orange-500",
  seminar: "from-cyan-500 to-blue-500",
  social: "from-orange-500 to-red-500",
  technical: "from-violet-500 to-purple-600",
  other: "from-indigo-500 to-purple-600",
};

const CATEGORY_EMOJI = {
  hackathon: "💻",
  cultural: "🎭",
  sports: "🏆",
  workshop: "🔧",
  seminar: "🎓",
  social: "🎉",
  technical: "⚙️",
  other: "📅",
};

const CATEGORY_COLORS = {
  hackathon: "bg-blue-100 text-blue-700",
  cultural: "bg-pink-100 text-pink-700",
  sports: "bg-green-100 text-green-700",
  workshop: "bg-yellow-100 text-yellow-700",
  seminar: "bg-purple-100 text-purple-700",
  social: "bg-orange-100 text-orange-700",
  technical: "bg-cyan-100 text-cyan-700",
  other: "bg-slate-100 text-slate-600",
};

function EventCard({ event, onViewDetails }) {
  const categoryColor =
    CATEGORY_COLORS[event.category] || CATEGORY_COLORS.other;
  const gradient = CATEGORY_GRADIENT[event.category] || CATEGORY_GRADIENT.other;
  const emoji = CATEGORY_EMOJI[event.category] || "📅";
  const imageUrl = event.image_url ? `${API_BASE}${event.image_url}` : null;

  const statusColor =
    event.status === "published"
      ? "bg-green-100 text-green-700"
      : event.status === "ongoing"
        ? "bg-blue-100 text-blue-700"
        : event.status === "completed"
          ? "bg-slate-100 text-slate-600"
          : "bg-yellow-100 text-yellow-700";

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer"
      onClick={() => onViewDetails(event)}
    >
      <div
        className={`relative h-40 bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {emoji}
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-black shadow-lg
            ${event.registration_fee > 0 ? "bg-orange-500 text-white" : "bg-green-500 text-white"}`}
          >
            {event.registration_fee > 0 ? `₹${event.registration_fee}` : "FREE"}
          </span>
        </div>
        {event.event_type && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize bg-white/90 text-slate-700">
              {event.event_type === "online"
                ? "🌐"
                : event.event_type === "hybrid"
                  ? "🔀"
                  : "📍"}{" "}
              {event.event_type}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${categoryColor}`}
          >
            {event.category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor}`}
          >
            {event.status}
          </span>
        </div>

        <h3 className="font-bold text-slate-800 leading-tight mb-1.5 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FaCalendarAlt className="text-indigo-400 flex-shrink-0" />
            {new Date(event.start_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FaMapMarkerAlt className="text-indigo-400 flex-shrink-0" />
              <span className="truncate">
                {event.venue ? `${event.venue}, ` : ""}
                {event.location}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FaUsers className="text-indigo-400 flex-shrink-0" />
            {event.current_participants || 0} / {event.max_participants}{" "}
            participants
          </div>
        </div>

        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {event.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(event);
          }}
          className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl text-xs hover:shadow-md transition-all"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}

function EventModal({ event, onClose }) {
  if (!event) return null;
  const gradient = CATEGORY_GRADIENT[event.category] || CATEGORY_GRADIENT.other;
  const emoji = CATEGORY_EMOJI[event.category] || "📅";
  const imageUrl = event.image_url ? `${API_BASE}${event.image_url}` : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`h-52 relative bg-gradient-to-br ${gradient} overflow-hidden`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-7xl">
              {emoji}
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition"
          >
            <FaTimes />
          </button>
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-black shadow
              ${event.registration_fee > 0 ? "bg-orange-500 text-white" : "bg-green-500 text-white"}`}
            >
              {event.registration_fee > 0
                ? `₹${event.registration_fee}`
                : "FREE"}
            </span>
            {event.event_type && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-700 capitalize">
                {event.event_type === "online"
                  ? "🌐"
                  : event.event_type === "hybrid"
                    ? "🔀"
                    : "📍"}{" "}
                {event.event_type}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.other}`}
            >
              {event.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 capitalize">
              {event.status}
            </span>
            {event.certificates && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                🏅 Certificate
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-4">
            {event.title}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                Start
              </p>
              <p className="font-semibold text-slate-700 text-sm">
                {new Date(event.start_date).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                End
              </p>
              <p className="font-semibold text-slate-700 text-sm">
                {new Date(event.end_date).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                Location
              </p>
              <p className="font-semibold text-slate-700 text-sm">
                {event.venue ? `${event.venue}, ` : ""}
                {event.location}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                Participants
              </p>
              <p className="font-semibold text-slate-700 text-sm">
                {event.current_participants || 0} / {event.max_participants}
              </p>
            </div>
            {event.registration_end && (
              <div className="col-span-2">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                  Registration Deadline
                </p>
                <p className="font-semibold text-slate-700 text-sm">
                  {new Date(event.registration_end).toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h4 className="font-bold text-slate-800 mb-2">About this Event</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {event.description}
            </p>
          </div>

          {event.tags?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-bold text-slate-800 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.eligibility && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <h4 className="font-bold text-green-800 mb-1 text-sm">
                ✅ Eligibility
              </h4>
              <p className="text-sm text-green-700">{event.eligibility}</p>
            </div>
          )}

          {event.requirements && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h4 className="font-bold text-amber-800 mb-1 text-sm">
                📋 Requirements
              </h4>
              <p className="text-sm text-amber-700">{event.requirements}</p>
            </div>
          )}

          {event.rules_and_regulations && (
            <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="font-bold text-slate-700 mb-1 text-sm">
                📜 Rules & Regulations
              </h4>
              <p className="text-sm text-slate-600">
                {event.rules_and_regulations}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <div className="flex-1">
              <p className="text-xs text-slate-400">Registration Fee</p>
              <p className="font-black text-lg text-indigo-600">
                {event.registration_fee > 0
                  ? `₹${event.registration_fee}`
                  : "FREE"}
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
              onClick={() =>
                toast.info("Registration coming in Milestone 3! 🚀")
              }
            >
              <FaTicketAlt /> Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [eventType, setEventType] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [feeFilter, setFeeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_asc");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    api
      .get("/events")
      .then((r) => {
        setEvents(r.data.events || []);
      })
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...events];
    const now = new Date();

    if (search)
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description?.toLowerCase().includes(search.toLowerCase()) ||
          e.location?.toLowerCase().includes(search.toLowerCase()) ||
          e.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
      );
    if (category !== "all")
      result = result.filter((e) => e.category === category);
    if (status !== "all") result = result.filter((e) => e.status === status);
    if (eventType !== "all")
      result = result.filter((e) => e.event_type === eventType);
    if (feeFilter === "free")
      result = result.filter(
        (e) => !e.registration_fee || e.registration_fee === 0,
      );
    if (feeFilter === "paid")
      result = result.filter((e) => e.registration_fee > 0);
    if (dateFilter === "today")
      result = result.filter(
        (e) => new Date(e.start_date).toDateString() === now.toDateString(),
      );
    if (dateFilter === "week") {
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      result = result.filter(
        (e) => new Date(e.start_date) >= now && new Date(e.start_date) <= end,
      );
    }
    if (dateFilter === "month") {
      const end = new Date(now);
      end.setMonth(end.getMonth() + 1);
      result = result.filter(
        (e) => new Date(e.start_date) >= now && new Date(e.start_date) <= end,
      );
    }

    if (sortBy === "date_asc")
      result.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    if (sortBy === "date_desc")
      result.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    if (sortBy === "name_asc")
      result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "participants")
      result.sort(
        (a, b) => (b.current_participants || 0) - (a.current_participants || 0),
      );

    setFiltered(result);
  }, [
    events,
    search,
    category,
    status,
    eventType,
    dateFilter,
    feeFilter,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setEventType("all");
    setDateFilter("");
    setFeeFilter("all");
    setSortBy("date_asc");
  };

  const activeFilterCount = [
    category !== "all",
    status !== "all",
    eventType !== "all",
    dateFilter !== "",
    feeFilter !== "all",
  ].filter(Boolean).length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black mb-1">Discover Events</h1>
            <p className="text-indigo-200 text-sm">
              Find and register for inter-college events near you
            </p>

            <div className="mt-5 relative max-w-2xl">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, location, or tag..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-slate-800 text-sm shadow-lg"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize
                    ${category === c ? "bg-white text-indigo-700 shadow-md" : "bg-white/20 text-white hover:bg-white/30"}`}
                >
                  {c === "all" ? "🌟 All" : `${CATEGORY_EMOJI[c]} ${c}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border
                ${showFilters ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200"}`}
            >
              <FaFilter />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 font-medium">
                {loading
                  ? "Loading..."
                  : `${filtered.length} event${filtered.length !== 1 ? "s" : ""} found`}
              </span>
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-8 pr-3 py-2 border-2 border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-500 bg-white text-slate-700 appearance-none"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                  <FaFilter className="text-indigo-500" /> Advanced Filters
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-700"
                  >
                    <FaTimes /> Clear All ({activeFilterCount})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 appearance-none bg-white font-medium"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c === "all"
                            ? "All Categories"
                            : c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 appearance-none bg-white font-medium"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s === "all"
                            ? "All Status"
                            : s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Mode
                  </label>
                  <div className="relative">
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 appearance-none bg-white font-medium"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t === "all"
                            ? "All Modes"
                            : t === "online"
                              ? "🌐 Online"
                              : t === "hybrid"
                                ? "🔀 Hybrid"
                                : "📍 Offline"}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Date
                  </label>
                  <div className="relative">
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 appearance-none bg-white font-medium"
                    >
                      {DATE_FILTERS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Fee
                  </label>
                  <div className="relative">
                    <select
                      value={feeFilter}
                      onChange={(e) => setFeeFilter(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 appearance-none bg-white font-medium"
                    >
                      {FEE_FILTERS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-medium self-center">
                    Active:
                  </span>
                  {category !== "all" && (
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      Category: {category}{" "}
                      <button onClick={() => setCategory("all")}>
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  )}
                  {status !== "all" && (
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      Status: {status}{" "}
                      <button onClick={() => setStatus("all")}>
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  )}
                  {eventType !== "all" && (
                    <span className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      Mode: {eventType}{" "}
                      <button onClick={() => setEventType("all")}>
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  )}
                  {dateFilter && (
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      Date:{" "}
                      {DATE_FILTERS.find((d) => d.value === dateFilter)?.label}{" "}
                      <button onClick={() => setDateFilter("")}>
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  )}
                  {feeFilter !== "all" && (
                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      Fee: {feeFilter}{" "}
                      <button onClick={() => setFeeFilter("all")}>
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="h-40 bg-slate-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-1/3" />
                    <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
                    <div className="h-8 bg-slate-200 rounded-xl animate-pulse mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg font-semibold text-slate-600">
                No events found
              </p>
              <p className="text-sm mt-1">
                Try adjusting your filters or search terms
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onViewDetails={setSelectedEvent}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}

export default StudentEvents;
