import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

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

function EventCard({ event, onDelete }) {
  const gradient = CATEGORY_GRADIENT[event.category] || CATEGORY_GRADIENT.other;
  const emoji = CATEGORY_EMOJI[event.category] || "📅";
  const imageUrl = event.image_url ? `${API_BASE}${event.image_url}` : null;

  const statusStyle =
    {
      published: "bg-green-100 text-green-700 border-green-200",
      draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: "bg-slate-100 text-slate-600 border-slate-200",
      ongoing: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-600 border-red-200",
    }[event.status] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Banner */}
      <div
        className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
        {/* Emoji fallback */}
        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {emoji}
          </div>
        )}

        {/* Featured badge */}
        {event.is_featured && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow">
              <FaStar className="text-xs" /> Featured
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold border capitalize ${statusStyle}`}
          >
            {event.status === "published" ? "✅" : "📋"} {event.status}
          </span>
        </div>

        {/* Bottom gradient overlay when image is shown */}
        {imageUrl && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-base leading-tight mb-1 truncate group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FaCalendarAlt className="text-indigo-400 flex-shrink-0" />
            {new Date(event.start_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FaMapMarkerAlt className="text-indigo-400 flex-shrink-0" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FaUsers className="text-indigo-400 flex-shrink-0" />
            {event.current_participants || 0}/{event.max_participants}{" "}
            participants
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-indigo-400">🏷</span>
            <span className="capitalize">{event.category}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Link
              to={`/events/${event._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition"
          >
            View Details →
          </Link>
          <Link
            to={`/admin/dashboard/events/${event._id}`}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition"
            title="Edit"
          >
            <FaEdit />
          </Link>
          <Link
            to={`/admin/dashboard/events/${event._id}/registrations`}
            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition"
            title="Registrations"
          >
            <FaUsers />
          </Link>
          <button
            onClick={() => onDelete(event._id)}
            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

function CollegeEvents() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data.events || []);
      setFiltered(res.data.events || []);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let result = [...events];
    if (search)
      result = result.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()),
      );
    if (statusFilter !== "all")
      result = result.filter((e) => e.status === statusFilter);
    setFiltered(result);
  }, [search, statusFilter, events]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800">My Events</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Manage your college events
              </p>
            </div>
            <Link
              to="/admin/dashboard/create-event"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <FaPlus /> + New Event
            </Link>
          </div>

          {/* Search + Filter */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              {[
                { label: "All", value: "all" },
                { label: "✅ Published", value: "published" },
                { label: "📋 Draft", value: "draft" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border
                    ${
                      statusFilter === f.value
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
                >
                  <div className="h-44 bg-slate-200 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
                    <div className="h-9 bg-slate-200 rounded-xl animate-pulse mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <FaCalendarAlt className="text-6xl mx-auto mb-4" />
              <p className="font-semibold text-slate-600 text-lg">
                {search || statusFilter !== "all"
                  ? "No events match your filters"
                  : "No events created yet"}
              </p>
              {!search && statusFilter === "all" && (
                <Link
                  to="/admin/dashboard/create-event"
                  className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                >
                  Create your first event →
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <p className="text-xs text-slate-400 mt-4 text-right">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>
    </>
  );
}

export default CollegeEvents;
