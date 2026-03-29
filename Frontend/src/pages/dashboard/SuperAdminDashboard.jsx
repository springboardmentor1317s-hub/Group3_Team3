import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaCalendarAlt,
  FaCheckCircle,
  FaChartBar,
  FaStar,
} from "react-icons/fa";

function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalColleges: 0,
    totalStudents: 0,
    totalRegistrations: 0,
    pendingAdmins: 0,
  });

  const [feedbackStats, setFeedbackStats] = useState({});
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [statsRes, feedbackRes, feedbackList] = await Promise.all([
        api.get("/superadmin/stats"),
        api.get("/feedback/admin/analysis"),
        api.get("/feedback/admin/all"),
      ]);

      setStats(statsRes.data.data);
      setFeedbackStats(feedbackRes.data.globalStats || {});
      setRecentFeedbacks((feedbackList.data.feedbacks || []).slice(0, 3));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      {/* 🔥 Reduced padding & full height */}
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-4 md:p-6">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          {/* LEFT SIDE */}
          <div className="lg:col-span-3 space-y-5">

            {/* HEADER */}
            <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-purple-900">
                  Super Admin Dashboard 👑
                </h1>
                <p className="text-purple-500 text-sm">
                  Manage platform & monitor analytics
                </p>
              </div>
              <FaChartBar className="text-purple-600 text-2xl" />
            </div>

            {/* ALERT */}
            {!loading && stats.pendingAdmins > 0 && (
              <Link
                to="/super-admin/pending-colleges"
                className="bg-pink-100 p-4 rounded-xl flex justify-between items-center"
              >
                <span className="text-pink-700 font-semibold text-base">
                  {stats.pendingAdmins} Admin approvals pending
                </span>
                <span>→</span>
              </Link>
            )}

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Events",
                  value: stats.totalEvents,
                  icon: <FaCalendarAlt />,
                },
                {
                  label: "Colleges",
                  value: stats.totalColleges,
                  icon: <FaUsers />,
                },
                {
                  label: "Students",
                  value: stats.totalStudents,
                  icon: <FaCheckCircle />,
                },
                {
                  label: "Feedbacks",
                  value: feedbackStats.totalFeedbacks || 0,
                  icon: <FaStar />,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl shadow flex items-center gap-4"
                >
                  <div className="p-3 bg-purple-600 text-white rounded-xl text-lg">
                    {s.icon}
                  </div>
                  <div>
                    {/* 🔥 BIGGER VALUE */}
                    <p className="text-2xl font-bold text-purple-900">
                      {loading ? "..." : s.value}
                    </p>
                    <p className="text-sm text-purple-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS (FIXED HEIGHT) */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Manage Events", link: "/super-admin/all-events" },
                { name: "Manage Colleges", link: "/super-admin/colleges" },
                { name: "Students", link: "/super-admin/students" },
                { name: "Registrations", link: "/super-admin/registrations" },
                { name: "Feedback Analytics", link: "/admin/feedback-analytics" },
                { name: "Reports", link: "/super-admin/reports" },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.link}
                  className="bg-purple-600 text-white p-6 rounded-2xl text-center shadow hover:scale-105 transition-all flex items-center justify-center text-lg font-semibold min-h-[80px]"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5 flex flex-col">

            {/* PROFILE */}
            <div className="bg-purple-600 text-white p-6 rounded-2xl text-center shadow">
              <h3 className="text-xl font-bold">Super Admin</h3>
              <p className="text-sm opacity-80">Full Access Control</p>
            </div>

            <Link
              to="/admin/feedback-analytics"
              className="block bg-pink-500 text-white p-4 rounded-xl text-center text-base font-semibold"
            >
              Feedback
            </Link>

            {/* RECENT FEEDBACK */}
            <div className="bg-white p-5 rounded-xl shadow flex-1">
              <h3 className="font-bold text-purple-900 mb-3 text-lg">
                Recent Feedback
              </h3>

              {recentFeedbacks.length === 0 ? (
                <p className="text-sm text-purple-400">No feedback</p>
              ) : (
                recentFeedbacks.map((f) => (
                  <div key={f._id} className="text-sm mb-3">
                    ⭐ {f.rating || "-"} - {f.comment?.slice(0, 50)}
                  </div>
                ))
              )}
            </div>

            {/* INSIGHT */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-2xl shadow">
              <h3 className="font-bold text-lg">Platform Insights 🚀</h3>
              <p className="text-sm mt-1">
                Monitor growth & improve engagement
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default SuperAdminDashboard;