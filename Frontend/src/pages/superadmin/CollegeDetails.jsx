// src/pages/superadmin/CollegeDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import {
  FaArrowLeft,
  FaUsers,
  FaChartLine,
  FaCalendarDays,
  FaCircleCheck,
} from "react-icons/fa6";
import { FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";

function CollegeDetails() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the college admin user by ID
        const userRes = await api.get(`/users/${id}`);
        const user = userRes.data.user || userRes.data;
        setAdmin(user);

        // Fetch all events and filter by this college
        const eventsRes = await api.get("/events");
        const allEvents = eventsRes.data.events || [];
        const collegeEvents = allEvents.filter(
          (e) => e.college_id === id || e.college === user.college,
        );
        setEvents(collegeEvents);
      } catch (err) {
        console.error("Failed to load college details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-slate-600">Loading college details...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="text-2xl font-bold mb-4">College not found</p>
          <Link
            to="/super-admin/colleges"
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
          >
            Back to Colleges
          </Link>
        </div>
      </div>
    );
  }

  const published = events.filter((e) => e.status === "published").length;
  const totalParticipants = events.reduce(
    (sum, e) => sum + (e.current_participants || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back + Header */}
        <Link
          to="/super-admin/colleges"
          className="inline-flex items-center gap-2 mb-8 text-indigo-600 hover:text-indigo-700 font-bold"
        >
          <FaArrowLeft /> Back to Colleges
        </Link>

        {/* College Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 mb-8">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl flex-shrink-0">
              {admin.college?.charAt(0).toUpperCase() || "C"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-slate-900">
                  {admin.college}
                </h1>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold flex items-center gap-1">
                  <FaCircleCheck /> Active
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 mt-2">
                <span className="font-semibold">Admin: {admin.name}</span>
                <span className="flex items-center gap-1">
                  <FaEnvelope className="text-indigo-400" />
                  {admin.email}
                </span>
                {admin.phone && (
                  <span className="flex items-center gap-1">
                    <FaPhone className="text-green-500" />
                    {admin.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FaCalendarDays /> Joined{" "}
                  {new Date(admin.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Events",
              value: events.length,
              icon: <FaCalendarAlt />,
              color: "from-indigo-500 to-purple-600",
            },
            {
              label: "Published",
              value: published,
              icon: <FaCircleCheck />,
              color: "from-emerald-500 to-teal-600",
            },
            {
              label: "Total Participants",
              value: totalParticipants,
              icon: <FaUsers />,
              color: "from-orange-400 to-pink-500",
            },
            {
              label: "Avg per Event",
              value: events.length
                ? Math.round(totalParticipants / events.length)
                : 0,
              icon: <FaChartLine />,
              color: "from-blue-500 to-cyan-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white mb-3`}
              >
                {stat.icon}
              </div>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Events List */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900">
              Events from this College
            </h2>
          </div>
          {events.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FaCalendarAlt className="text-6xl mx-auto mb-4 opacity-20" />
              <p className="font-bold">No events yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="px-8 py-5 flex items-center justify-between hover:bg-slate-50"
                >
                  <div>
                    <p className="font-bold text-slate-900">{event.title}</p>
                    <p className="text-sm text-slate-500 capitalize">
                      {event.category} •{" "}
                      {new Date(event.start_date).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">
                      {event.current_participants || 0}/{event.max_participants}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        event.status === "published"
                          ? "bg-green-100 text-green-700"
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
  );
}

export default CollegeDetails;