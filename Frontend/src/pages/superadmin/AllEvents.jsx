// src/pages/superadmin/AllEvents.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { FaSearch, FaCalendarAlt, FaUsers } from "react-icons/fa";

function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data.events || []))
      .catch((err) => console.error("Failed to load events", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const matchSearch = e.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">All Events</h1>
              <p className="text-slate-500">All events across every college</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/80 rounded-3xl p-6 shadow border border-white/50 mb-8 flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <FaCalendarAlt /> Events ({filtered.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-slate-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <FaCalendarAlt className="text-7xl mx-auto mb-4 opacity-20" />
                <p className="text-xl font-bold">No events found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map((event) => (
                  <div
                    key={event._id}
                    className="px-8 py-5 hover:bg-slate-50 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0">
                        {event.category?.charAt(0).toUpperCase() || "E"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {event.title}
                        </p>
                        <p className="text-sm text-slate-500 capitalize">
                          {event.category} • {event.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <FaCalendarAlt />{" "}
                        {new Date(event.start_date).toLocaleDateString("en-IN")}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <FaUsers /> {event.current_participants || 0}/
                        {event.max_participants}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          event.status === "published"
                            ? "bg-green-100 text-green-700"
                            : event.status === "ongoing"
                              ? "bg-blue-100 text-blue-700"
                              : event.status === "completed"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AllEvents;