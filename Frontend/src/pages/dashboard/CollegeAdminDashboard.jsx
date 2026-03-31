import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaTicketAlt,
  FaStar,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

function CollegeAdminDashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({});
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [eventRes, feedbackList] = await Promise.all([
        // ✅ FIX 1: filter events by this admin's college_id
        api.get(`/events?college_id=${user._id}`),
        api.get("/feedback/admin/all"),
      ]);

      const eventsData = eventRes.data.events || [];
      const sortedEvents = eventsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setEvents(sortedEvents);

      // ✅ FIX 2: correct response field is feedbacks not data
      // ✅ FIX 3: backend already filters by college — no frontend filter needed
      const allFeedbacks = feedbackList.data.feedbacks || [];
      const ratedFeedbacks = allFeedbacks.filter((f) => f.rating > 0);
      const avgRating =
        ratedFeedbacks.length > 0
          ? (
              ratedFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
              ratedFeedbacks.length
            ).toFixed(1)
          : 0;

      setRecentFeedbacks(allFeedbacks.slice(0, 3));
      setFeedbackStats({
        totalFeedbacks: allFeedbacks.length,
        globalAvg: avgRating,
      });
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRegistrations = async () => {
    try {
      setPendingLoading(true);
      // ✅ FIX: filter events by this admin only
      const eventRes = await api.get(`/events?college_id=${user._id}`);
      const myEvents = eventRes.data.events || [];

      let allPending = [];
      await Promise.all(
        myEvents.map(async (ev) => {
          try {
            const regRes = await api.get(`/registrations/event/${ev._id}`);
            const regs = regRes.data.registrations || [];
            const pending = regs
              .filter((r) => r.status === "pending")
              .map((r) => ({
                _id: r._id,
                studentName: r.user_id?.name || "—",
                email: r.user_id?.email || "—",
                eventTitle: ev.title,
              }));
            allPending = [...allPending, ...pending];
          } catch (_) {}
        }),
      );
      setPendingRegistrations(allPending);
    } catch (err) {
      console.error(err);
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPendingRegistrations();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/registrations/${id}/status`, { status: "approved" });
      toast.success("✅ Approved!");
      fetchPendingRegistrations();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/registrations/${id}/status`, { status: "rejected" });
      toast.success("Rejected.");
      fetchPendingRegistrations();
    } catch {
      toast.error("Failed to reject");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-purple-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-3 space-y-6">
            {/* HEADER */}
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-purple-900">
                  Welcome, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-purple-500">{user?.college}</p>
              </div>
              <FaUsers className="text-purple-600 text-2xl" />
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : events.length}
                </p>
                <p className="text-sm text-slate-500 mt-1">Total Events</p>
                <FaTicketAlt className="text-yellow-500 mt-2" />
              </div>
              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : feedbackStats.totalFeedbacks || 0}
                </p>
                <p className="text-sm text-slate-500 mt-1">Feedbacks</p>
                <FaStar className="text-yellow-500 mt-2" />
              </div>
              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? "..." : feedbackStats.globalAvg || "—"}
                </p>
                <p className="text-sm text-slate-500 mt-1">Avg Rating</p>
                <FaCheckCircle className="text-green-500 mt-2" />
              </div>
              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-2xl font-bold text-slate-900">
                  {pendingLoading ? "..." : pendingRegistrations.length}
                </p>
                <p className="text-sm text-slate-500 mt-1">Pending</p>
                <FaClock className="text-yellow-500 mt-2" />
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/admin/dashboard/create-event"
                className="bg-purple-600 hover:bg-purple-700 text-white p-5 rounded-2xl text-center transition-all shadow hover:shadow-lg"
              >
                <FaPlus className="mx-auto mb-2 text-xl" />
                <p className="font-bold">Create Event</p>
              </Link>
              <Link
                to="/admin/dashboard/events"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl text-center transition-all shadow hover:shadow-lg"
              >
                <p className="font-bold">Manage Events</p>
              </Link>
              <Link
                to="/admin/feedback-analytics"
                className="bg-pink-500 hover:bg-pink-600 text-white p-5 rounded-2xl text-center transition-all shadow hover:shadow-lg"
              >
                <FaStar className="mx-auto mb-2 text-xl" />
                <p className="font-bold">Feedback Analytics</p>
              </Link>
            </div>

            {/* PENDING APPROVALS */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FaSpinner className="animate-spin text-yellow-500" />
                Pending Approvals ({pendingRegistrations.length})
              </h2>

              {pendingLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-14 bg-slate-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : pendingRegistrations.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <FaCheckCircle className="text-5xl mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">
                    All clear! No pending approvals
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRegistrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="flex justify-between items-center border border-slate-200 p-4 rounded-xl hover:bg-slate-50 transition-all"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {reg.studentName}
                        </p>
                        <p className="text-sm text-slate-600">
                          {reg.eventTitle}
                        </p>
                        <p className="text-xs text-slate-400">{reg.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(reg._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(reg._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            {/* PROFILE */}
            <div
              onClick={() => navigate("/admin/profile")}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-5 rounded-2xl text-center shadow cursor-pointer hover:scale-105 transition"
            >
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold">{user?.name}</h3>
              <p className="text-sm opacity-80">{user?.college}</p>
              <p className="text-xs mt-2 opacity-70">Click to edit ✏️</p>
            </div>

            {/* RECENT FEEDBACK */}
            <div className="bg-white/80 p-4 rounded-xl shadow">
              <h3 className="font-bold text-purple-900 mb-3">
                Recent Feedback
              </h3>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 bg-slate-100 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : recentFeedbacks.length === 0 ? (
                <p className="text-sm text-purple-400">No feedback yet</p>
              ) : (
                recentFeedbacks.map((f) => (
                  <div
                    key={f._id}
                    className="text-sm mb-2 p-2 bg-purple-50 rounded-lg"
                  >
                    <span className="font-semibold">⭐ {f.rating || "—"}</span>
                    <span className="text-slate-600">
                      {" "}
                      — {f.comment?.slice(0, 40)}...
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* MOTIVATION */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-2xl shadow">
              <h3 className="font-bold">Improve Events 🚀</h3>
              <p className="text-sm mt-1 opacity-90">
                Analyze feedback and enhance student experience
              </p>
              <Link
                to="/admin/feedback-analytics"
                className="inline-block mt-3 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-all"
              >
                View Analytics →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CollegeAdminDashboard;
