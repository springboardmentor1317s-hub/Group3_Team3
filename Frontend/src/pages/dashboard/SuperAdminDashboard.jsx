import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaServer,
  FaDatabase,
  FaBolt,
} from "react-icons/fa";

function SuperAdminDashboard() {
  const user = getUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events")
      .then((r) => setEvents(r.data.events || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Total Events",
      value: events.length,
      change: "+12%",
      icon: <FaCalendarAlt />,
      color: "from-indigo-500 to-purple-600",
    },
    {
      label: "Active Users",
      value: "1,234",
      change: "+8%",
      icon: <FaUsers />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Total Registrations",
      value: events.reduce((s, e) => s + (e.current_participants || 0), 0),
      change: "+23%",
      icon: <FaCheckCircle />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      label: "Pending Reviews",
      value: 0,
      change: "-2%",
      icon: <FaExclamationTriangle />,
      color: "from-orange-400 to-pink-500",
    },
  ];

  const systemHealth = [
    { label: "Server Status", value: "Healthy", color: "text-green-600" },
    { label: "Database", value: "Connected", color: "text-green-600" },
    { label: "API Response", value: "152ms", color: "text-blue-600" },
    { label: "Uptime", value: "99.9%", color: "text-green-600" },
  ];

  const tabs = [
    "Overview",
    "User Management",
    "Event Management",
    "Registrations",
    "Admin Logs",
  ];
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-800">
                Admin Dashboard
              </h1>
              <p className="text-slate-500 mt-1">
                Manage platform activities and monitor performance
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-white transition">
                Filter
              </button>
              <Link
                to="/super-admin/pending-events"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition"
              >
                <FaShieldAlt /> Security
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg mb-3`}
                >
                  {s.icon}
                </div>
                <p className="text-2xl font-black text-slate-800">{s.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-slate-500 font-medium">
                    {s.label}
                  </p>
                  <span
                    className={`text-xs font-semibold ${s.change.startsWith("+") ? "text-green-600" : "text-red-500"}`}
                  >
                    {s.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm border border-slate-100 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-800 mb-4">
                Recent Events
              </h2>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-slate-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <p className="text-slate-400 text-sm">No events yet.</p>
              ) : (
                <div className="space-y-3">
                  {events.slice(0, 5).map((e) => (
                    <div
                      key={e._id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <FaCalendarAlt className="text-indigo-600 text-sm" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">
                            {e.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {e.current_participants || 0} participants
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize
                        ${e.category === "hackathon" ? "bg-blue-100 text-blue-700" : e.category === "cultural" ? "bg-pink-100 text-pink-700" : "bg-purple-100 text-purple-700"}`}
                      >
                        {e.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-black text-slate-800 mb-4">
                System Health
              </h2>
              <div className="space-y-4">
                {systemHealth.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      {i === 0 && <FaServer className="text-slate-400" />}
                      {i === 1 && <FaDatabase className="text-slate-400" />}
                      {i === 2 && <FaBolt className="text-slate-400" />}
                      {i === 3 && <FaCheckCircle className="text-slate-400" />}
                      {h.label}
                    </div>
                    <span className={`font-bold text-sm ${h.color}`}>
                      {h.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  to="/super-admin/pending-events"
                  className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition"
                >
                  Pending Events
                </Link>
                <Link
                  to="/super-admin/pending-colleges"
                  className="flex items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-100 transition"
                >
                  Pending Colleges
                </Link>
                <Link
                  to="/super-admin/colleges"
                  className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition"
                >
                  All Colleges
                </Link>
                <Link
                  to="/super-admin/reports"
                  className="flex items-center gap-2 p-3 bg-orange-50 text-orange-700 rounded-xl text-sm font-semibold hover:bg-orange-100 transition"
                >
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminDashboard;