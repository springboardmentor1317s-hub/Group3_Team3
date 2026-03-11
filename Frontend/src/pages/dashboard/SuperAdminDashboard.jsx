import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import {
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
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
    totalRegistrations: 0,
    pendingEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, collegesRes] = await Promise.all([
          api.get("/events"),
          api.get("/users?role=college_admin"),
        ]);
        const events = eventsRes.data.events || [];
        const colleges = collegesRes.data.users || [];
        const pending = events.filter((e) => e.status === "draft").length;
        const totalRegs = events.reduce(
          (sum, e) => sum + (e.current_participants || 0),
          0,
        );
        setStats({
          totalEvents: events.length,
          totalColleges: colleges.length,
          totalRegistrations: totalRegs,
          pendingEvents: pending,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                <FaChartBar className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent">
                  Super Admin Dashboard
                </h1>
                <p className="text-xl text-slate-600 mt-1">
                  Platform-wide management & analytics
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link to="/super-admin/all-events" className="group">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaCalendarAlt className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Total Events
                    </p>
                    <p className="text-3xl font-black text-slate-900">
                      {loading ? "—" : stats.totalEvents}
                    </p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm flex items-center gap-1">
                  <FaClock className="text-amber-500" />{" "}
                  {loading ? "—" : stats.pendingEvents} pending
                </p>
              </div>
            </Link>

            <Link to="/super-admin/colleges" className="group">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaUsers className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Colleges
                    </p>
                    <p className="text-3xl font-black text-slate-900">
                      {loading ? "—" : stats.totalColleges}
                    </p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">Active college admins</p>
              </div>
            </Link>

            <Link to="/super-admin/reports" className="group">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaCheckCircle className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Registrations
                    </p>
                    <p className="text-3xl font-black text-slate-900">
                      {loading
                        ? "—"
                        : stats.totalRegistrations.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">
                  Total student registrations
                </p>
              </div>
            </Link>

            <Link to="/super-admin/pending-colleges" className="group">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaExclamationTriangle className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Pending Events
                    </p>
                    <p className="text-3xl font-black text-slate-900">
                      {loading ? "—" : stats.pendingEvents}
                    </p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">Awaiting approval</p>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <FaSearch className="text-indigo-600" />
                Quick Overview
              </h2>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events, colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 w-80 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Management Actions */}
          <div className="grid md:grid-cols-2 gap-8">
            <Link
              to="/super-admin/pending-events"
              className="group bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-amber-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaExclamationTriangle className="text-white" />
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
                className="block w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
              >
                <FaUserPlus className="text-3xl mx-auto mb-3" />
                <h4 className="font-bold text-xl">Manage Colleges</h4>
                <p className="text-emerald-100 text-sm">View all colleges</p>
              </Link>
              <Link
                to="/super-admin/reports"
                className="block w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-center"
              >
                <FaBell className="text-3xl mx-auto mb-3" />
                <h4 className="font-bold text-xl">View Reports</h4>
                <p className="text-indigo-100 text-sm">Analytics dashboard</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminDashboard;
