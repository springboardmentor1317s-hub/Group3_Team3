// src/pages/dashboard/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaBell,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

function StudentDashboard() {
  const user = getUser();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/registrations/my")
      .then((res) => setRegistrations(res.data.registrations || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const approved = registrations.filter((r) => r.status === "approved").length;
  const pending = registrations.filter((r) => r.status === "pending").length;
  const rejected = registrations.filter((r) => r.status === "rejected").length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900">
              Welcome back, {user?.name?.split(" ")[0] || "Student"} 👋
            </h1>
            <p className="text-slate-500 mt-1">{user?.college}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Registrations",
                value: registrations.length,
                icon: <FaTicketAlt />,
                color: "from-indigo-500 to-purple-600",
              },
              {
                label: "Approved",
                value: approved,
                icon: <FaCheckCircle />,
                color: "from-emerald-500 to-teal-600",
              },
              {
                label: "Pending",
                value: pending,
                icon: <FaClock />,
                color: "from-amber-500 to-orange-500",
              },
              {
                label: "Rejected",
                value: rejected,
                icon: <FaTimesCircle />,
                color: "from-red-500 to-rose-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 shadow border border-slate-100"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white mb-3`}
                >
                  {stat.icon}
                </div>
                <p className="text-3xl font-black text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link
              to="/student/events"
              className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-6 shadow hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <FaCalendarAlt className="text-3xl mb-3" />
              <h3 className="text-xl font-black">Browse Events</h3>
              <p className="text-indigo-200 text-sm mt-1">
                Discover and register for events
              </p>
            </Link>
            <Link
              to="/student/registrations"
              className="bg-white rounded-3xl p-6 shadow border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <FaTicketAlt className="text-3xl text-indigo-500 mb-3" />
              <h3 className="text-xl font-black text-slate-900">
                My Registrations
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Track your event registrations
              </p>
            </Link>
            <Link
              to="/student/profile"
              className="bg-white rounded-3xl p-6 shadow border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <FaUser className="text-3xl text-indigo-500 mb-3" />
              <h3 className="text-xl font-black text-slate-900">My Profile</h3>
              <p className="text-slate-500 text-sm mt-1">
                View and edit your profile
              </p>
            </Link>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-3xl shadow border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Recent Registrations
              </h2>
              <Link
                to="/student/registrations"
                className="text-indigo-600 font-bold text-sm hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-slate-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : registrations.length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <FaCalendarAlt className="text-5xl mx-auto mb-4 opacity-30" />
                <p className="font-semibold">No registrations yet</p>
                <Link
                  to="/student/events"
                  className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {registrations.slice(0, 5).map((reg) => {
                  const event = reg.event_id || {};
                  return (
                    <div
                      key={reg._id}
                      className="px-8 py-4 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {event.title || "Event"}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {event.category} • {event.location}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          reg.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : reg.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {reg.status === "approved"
                          ? "✅ "
                          : reg.status === "rejected"
                            ? "❌ "
                            : "⏳ "}
                        {reg.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;