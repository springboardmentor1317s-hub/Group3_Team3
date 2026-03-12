// src/pages/student/MyRegistrations.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaClock,
  FaList,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";

function MyRegistrations() {
  const navigate = useNavigate();
  const user = getUser();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: correct endpoint from your backend registration.routes.js
      const res = await api.get("/registrations/my");
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchRegistrations();
  }, []);

  // ✅ FIXED: backend populates event_id object, not flat fields
  const filteredRegistrations = registrations.filter((reg) => {
    const eventTitle = reg.event_id?.title?.toLowerCase() || "";
    const matchesSearch = eventTitle.includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || reg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800",
    };
    const icons = { pending: "⏳", approved: "✅", rejected: "❌" };
    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${map[status] || "bg-slate-100 text-slate-800"}`}
      >
        {icons[status] || "•"}{" "}
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    );
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/student/dashboard"
                className="p-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow hover:shadow-md transition"
              >
                <FaArrowLeft className="text-slate-700" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-slate-900">
                  My Registrations
                </h1>
                <p className="text-slate-500 mt-1">
                  Track all your event registrations
                </p>
              </div>
            </div>
            <button
              onClick={fetchRegistrations}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow hover:shadow-lg transition"
            >
              <FaList /> Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow border border-slate-100 mb-6">
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div className="relative md:col-span-2">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by event name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-sm outline-none transition"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-sm outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="approved">✅ Approved</option>
                <option value="rejected">❌ Rejected</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Showing {filteredRegistrations.length} of {registrations.length}{" "}
              registrations
            </p>
          </div>

          {/* List */}
          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 shadow animate-pulse space-y-3"
                >
                  <div className="h-5 bg-slate-200 rounded-full w-2/3" />
                  <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                  <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 shadow text-center">
              <FaList className="text-6xl text-slate-200 mx-auto mb-5" />
              <h2 className="text-xl font-bold text-slate-700 mb-2">
                No registrations found
              </h2>
              <p className="text-slate-500 mb-6">
                {registrations.length === 0
                  ? "You haven't registered for any events yet."
                  : "No results match your filters."}
              </p>
              <Link
                to="/student/events"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow hover:shadow-lg transition"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRegistrations.map((reg) => {
                // ✅ FIXED: data comes from populated event_id object
                const event = reg.event_id || {};
                return (
                  <div
                    key={reg._id}
                    className="bg-white rounded-3xl shadow border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
                  >
                    {/* Top colored bar by status */}
                    <div
                      className={`h-1.5 w-full ${reg.status === "approved" ? "bg-emerald-400" : reg.status === "rejected" ? "bg-red-400" : "bg-amber-400"}`}
                    />

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4 gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow">
                            <FaCalendarAlt className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-900 leading-tight line-clamp-1">
                              {event.title || "Event"}
                            </h3>
                            <p className="text-xs text-slate-500 capitalize">
                              {event.category || ""}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={reg.status} />
                      </div>

                      <div className="space-y-2 text-sm text-slate-600">
                        {event.start_date && (
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-indigo-400 flex-shrink-0" />
                            {new Date(event.start_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-indigo-400 flex-shrink-0" />
                            {event.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FaClock className="text-indigo-400 flex-shrink-0" />
                          Registered on{" "}
                          {new Date(
                            reg.timestamp || reg.createdAt,
                          ).toLocaleDateString("en-IN")}
                        </div>
                      </div>

                      {event.description && (
                        <p className="mt-3 text-xs text-slate-500 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyRegistrations;
