import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaTicketAlt,
  FaStar,
  FaPlus,
  FaSpinner
} from "react-icons/fa";
import { toast } from "react-toastify";

function CollegeAdminDashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({});
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);

  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  const [loading, setLoading] = useState(true);

  // 🔥 FETCH ALL DATA
  const fetchData = async () => {
    try {
      const [eventRes, feedbackRes, feedbackList] = await Promise.all([
        api.get("/events"),
        api.get("/feedback/admin/analysis"),
        api.get("/feedback/admin/all"),
      ]);

      const eventsData = eventRes.data.events || [];

      const sortedEvents = eventsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setEvents(sortedEvents);
      setFeedbackStats(feedbackRes.data.globalStats || {});
      setRecentFeedbacks((feedbackList.data.feedbacks || []).slice(0, 3));

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FETCH PENDING REGISTRATIONS (IMPORTANT)
  const fetchPendingRegistrations = async () => {
    try {
      setPendingLoading(true);

      const eventRes = await api.get("/events");
      const events = eventRes.data.events || [];

      let allPending = [];

      await Promise.all(
        events.map(async (ev) => {
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
          } catch (err) {}
        })
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

  // ✅ APPROVE
  const handleApprove = async (id) => {
    try {
      await api.put(`/registrations/${id}/status`, { status: "approved" });
      toast.success("Approved");
      fetchPendingRegistrations();
    } catch {
      toast.error("Failed");
    }
  };

  // ✅ REJECT
  const handleReject = async (id) => {
    try {
      await api.put(`/registrations/${id}/status`, { status: "rejected" });
      toast.success("Rejected");
      fetchPendingRegistrations();
    } catch {
      toast.error("Failed");
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
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow flex justify-between">
              <div>
                <h1 className="text-2xl font-bold text-purple-900">
                  Welcome, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-purple-500">{user?.college}</p>
              </div>
              <FaUsers className="text-purple-600 text-xl" />
            </div>

            {/* STATS */}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-xl font-bold">{events.length}</p>
                <FaTicketAlt className="text-yellow-500 from-purple-500-to-indigo-600" />
                <p>Total Events</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-xl font-bold">{feedbackStats.totalFeedbacks || 0}</p>
                <p>Feedbacks</p>
                <FaStar className="text-yellow-500" />
              </div>

              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-xl font-bold">{feedbackStats.globalAvg || 0}</p>
                <p>Avg Rating</p>
                <FaCheckCircle className="text-green-500" />
              </div>

              <div className="bg-white p-5 rounded-2xl shadow">
                <p className="text-xl font-bold">{pendingRegistrations.length}</p>
                <p>Pending</p>
                <FaClock className="text-yellow-500" />
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/admin/dashboard/create-event" className="bg-purple-600 text-white p-5 rounded-2xl text-center">
                <FaPlus className="mx-auto mb-2" />
                Create Event
              </Link>

              <Link to="/admin/dashboard/events" className="bg-indigo-600 text-white p-5 rounded-2xl text-center">
                Manage Events
              </Link>
            </div>

            {/* 🔥 PENDING APPROVALS */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <FaSpinner className="animate-spin text-yellow-500" />
                Pending Approvals ({pendingRegistrations.length})
              </h2>

              {pendingLoading ? (
                <p>Loading...</p>
              ) : pendingRegistrations.length === 0 ? (
                <p>No pending approvals</p>
              ) : (
                pendingRegistrations.map((reg) => (
                  <div key={reg._id} className="flex justify-between border p-3 mb-2 rounded">
                    <div>
                      <p className="font-bold">{reg.studentName}</p>
                      <p className="text-sm">{reg.eventTitle}</p>
                      <p className="text-xs">{reg.email}</p>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(reg._id)} className="bg-green-500 text-white px-3 py-1 rounded">
                        Approve
                      </button>
                      <button onClick={() => handleReject(reg._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                        Reject
                      </button>
                    </div>
                  </div>
                ))
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
              <h3>{user?.name}</h3>
              <p className="text-sm opacity-80">{user?.college}</p>
              <p className="text-xs mt-2 opacity-80">Click to edit ✏️</p>
            </div>


            {/* RECENT FEEDBACK */}
            <div className="bg-white/80 p-4 rounded-xl shadow">
              <h3 className="font-bold text-purple-900 mb-2">
                Recent Feedback
              </h3>

              {recentFeedbacks.length === 0 ? (
                <p className="text-sm text-purple-400">No feedback yet</p>
              ) : (
                recentFeedbacks.map((f) => (
                  <div key={f._id} className="text-sm mb-2">
                    ⭐ {f.rating || "-"} - {f.comment?.slice(0, 40)}
                  </div>
                ))
              )}
            </div>

            {/* MOTIVATION */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-2xl shadow">
              <h3 className="font-bold">Improve Events 🚀</h3>
              <p className="text-sm mt-1">
                Analyze feedback and enhance student experience
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}


export default CollegeAdminDashboard;