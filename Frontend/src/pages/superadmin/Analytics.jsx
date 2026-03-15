// src/pages/superadmin/Analytics.jsx
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import {
  FaChartLine,
  FaUsers,
  FaCalendarDays,
  FaCircleCheck,
} from "react-icons/fa6";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalRegistrations: 0,
    approvedRegistrations: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, usersRes] = await Promise.all([
          api.get("/events"),
          api.get("/users"),
        ]);

        const events = eventsRes.data.events || [];
        const users = usersRes.data.users || usersRes.data || [];

        const totalParticipants = events.reduce(
          (sum, e) => sum + (e.current_participants || 0),
          0,
        );

        setStats({
          totalEvents: events.length,
          publishedEvents: events.filter((e) => e.status === "published")
            .length,
          totalStudents: users.filter((u) => u.role === "student").length,
          totalAdmins: users.filter((u) => u.role === "college_admin").length,
          totalRegistrations: totalParticipants,
          approvedRegistrations: totalParticipants,
        });

        setRecentEvents(events.slice(0, 5));
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Events",
      value: stats.totalEvents,
      icon: <FaCalendarDays />,
      color: "from-indigo-500 to-purple-600",
    },
    {
      label: "Published Events",
      value: stats.publishedEvents,
      icon: <FaCircleCheck />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: <FaUsers />,
      color: "from-orange-400 to-pink-500",
    },
    {
      label: "College Admins",
      value: stats.totalAdmins,
      icon: <FaChartLine />,
      color: "from-blue-500 to-cyan-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent mb-3">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-slate-600">
              Platform-wide performance overview
            </p>
          </div>
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl flex items-center gap-2 transition-all self-start">
            📥 Export Report
          </button>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-36 bg-white rounded-3xl shadow animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {statCards.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-xl shadow-lg mb-4`}
                >
                  {s.icon}
                </div>
                <p className="text-4xl font-black text-slate-900 mb-1">
                  {s.value.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Recent Events Table */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50">
            <h2 className="text-2xl font-black text-slate-900">
              Recent Events
            </h2>
          </div>
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="font-bold">No events yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentEvents.map((event) => (
                <div
                  key={event._id}
                  className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-all"
                >
                  <div>
                    <p className="font-bold text-slate-900">{event.title}</p>
                    <p className="text-sm text-slate-500 capitalize">
                      {event.category} • {event.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">
                      {event.current_participants || 0} /{" "}
                      {event.max_participants} participants
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

export default Analytics;