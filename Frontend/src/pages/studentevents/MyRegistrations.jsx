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
import { toast } from "react-toastify";

function MyRegistrations() {
  const navigate = useNavigate();
  const user = getUser();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ✅ FIXED: was /students/:id/registrations → correct endpoint is /registrations/my
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/registrations/my");
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      toast.error("Failed to load registrations");
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

  // ✅ FIXED: was reading reg.studentName / reg.eventTitle (flat fields)
  // Now reads from populated reg.event_id object
  const filteredRegistrations = registrations.filter((reg) => {
    const title = reg.event_id?.title || "";
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || reg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    if (status === "approved")
      return (
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
          ✅ Approved
        </span>
      );
    if (status === "rejected")
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
          ❌ Rejected
        </span>
      );
    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
        ⏳ Pending
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
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/student/dashboard"
                className="p-3 bg-white/60 rounded-2xl shadow hover:shadow-md transition"
              >
                <FaArrowLeft className="text-slate-700" />
              </Link>
              <div>
                <h1 className="text-4xl font-black text-slate-900">
                  My Registrations
                </h1>
                <p className="text-slate-500 mt-1">
                  Track all your event registrations
                </p>
              </div>
            </div>
            <button
              onClick={fetchRegistrations}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow hover:shadow-lg transition"
            >
              <FaList /> Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white/80 rounded-3xl p-6 shadow border border-slate-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by event name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending ⏳</option>
                <option value="approved">Approved ✅</option>
                <option value="rejected">Rejected ❌</option>
              </select>
              <span className="text-sm text-slate-500 flex-shrink-0">
                {filteredRegistrations.length} of {registrations.length} shown
              </span>
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 bg-white rounded-3xl shadow animate-pulse"
                />
              ))}
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 shadow text-center text-slate-400">
              <FaList className="text-6xl mx-auto mb-4 opacity-20" />
              <h2 className="text-2xl font-bold text-slate-700 mb-2">
                No registrations found
              </h2>
              <p className="mb-6">Register for events to see them here.</p>
              <Link
                to="/events"
                className="inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((reg) => {
                const event = reg.event_id || {};
                return (
                  <div
                    key={reg._id}
                    className="bg-white rounded-3xl shadow border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden"
                  >
                    <div className="p-6 flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl flex-shrink-0">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-slate-900">
                            {event.title || "Event"}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
                            {event.category && (
                              <span className="capitalize bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                                {event.category}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt />
                                {event.location}
                              </span>
                            )}
                            {event.start_date && (
                              <span className="flex items-center gap-1">
                                <FaClock />
                                {new Date(event.start_date).toLocaleDateString(
                                  "en-IN",
                                )}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Registered on{" "}
                            {new Date(reg.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <StatusBadge status={reg.status} />
                        <Link
                          to={`/events/${event._id}`}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-sm hover:bg-indigo-100 transition"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                    {reg.status === "rejected" && (
                      <div className="px-6 pb-4 text-xs text-red-500">
                        Your registration was not approved. Please contact the
                        event organizer.
                      </div>
                    )}
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
