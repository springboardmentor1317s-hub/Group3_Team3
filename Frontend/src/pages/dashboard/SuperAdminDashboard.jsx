// src/pages/dashboard/SuperAdminDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import {
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserPlus,
  FaChartBar,
  FaEye,
  FaClock,
  FaBell,
} from "react-icons/fa";

function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalColleges: 0,
    totalStudents: 0,
    pendingEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: was hardcoded numbers + fake setTimeout
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, usersRes] = await Promise.all([
          api.get("/events"),
          api.get("/users"),
        ]);

        const events = eventsRes.data.events || [];
        const users = usersRes.data.users || usersRes.data || [];

        const colleges = new Set(
          users.filter((u) => u.role === "college_admin").map((u) => u.college),
        );

        setStats({
          totalEvents: events.length,
          totalColleges: colleges.size,
          totalStudents: users.filter((u) => u.role === "student").length,
          pendingEvents: events.filter((e) => e.status === "draft").length,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
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
      sub: `${stats.pendingEvents} pending`,
      icon: <FaCalendarAlt className="text-white text-2xl" />,
      color: "from-indigo-500 to-purple-600",
      link: "/super-admin/all-events",
    },
    {
      label: "Colleges",
      value: stats.totalColleges,
      sub: "Active college admins",
      icon: <FaUsers className="text-white text-2xl" />,
      color: "from-emerald-500 to-teal-600",
      link: "/super-admin/colleges",
    },
    {
      label: "Students",
      value: stats.totalStudents,
      sub: "Registered students",
      icon: <FaCheckCircle className="text-white text-2xl" />,
      color: "from-orange-500 to-red-500",
      link: "/super-admin/reports",
    },
    {
      label: "Pending Events",
      value: stats.pendingEvents,
      sub: "Awaiting approval",
      icon: <FaChartBar className="text-white text-2xl" />,
      color: "from-amber-500 to-yellow-500",
      link: "/super-admin/pending-events",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                <FaChartBar className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent">
                  Super Admin Dashboard
                </h1>
                <p className="text-slate-600 mt-1">
                  Platform-wide management & analytics
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((s, i) => (
              <Link to={s.link} key={i} className="group">
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                        {s.label}
                      </p>
                      {loading ? (
                        <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mt-1" />
                      ) : (
                        <p className="text-3xl font-black text-slate-900">
                          {s.value.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
                    <FaClock className="text-amber-500" /> {s.sub}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Management Actions */}
          <div className="grid md:grid-cols-2 gap-8">
            <Link
              to="/super-admin/pending-events"
              className="group bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-amber-200 transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaExclamationTriangle className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Pending Events
                  </h3>
                  <p className="text-slate-600">
                    {loading
                      ? "Loading..."
                      : `${stats.pendingEvents} events awaiting approval`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
                Review Now <FaEye className="ml-1" />
              </div>
            </Link>

            <div className="space-y-4">
              <Link
                to="/super-admin/colleges"
                className="flex items-center gap-4 w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <FaUserPlus className="text-3xl flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xl">Manage Colleges</h4>
                  <p className="text-emerald-100 text-sm">
                    View all colleges & admins
                  </p>
                </div>
              </Link>
              <Link
                to="/super-admin/reports"
                className="flex items-center gap-4 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <FaBell className="text-3xl flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xl">View Reports</h4>
                  <p className="text-indigo-100 text-sm">Analytics dashboard</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminDashboard;