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
} from "react-icons/fa";

function CollegeAdminDashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({});
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
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

      // SORT latest first
      const sortedEvents = eventsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setEvents(sortedEvents);

      setFeedbackStats(feedbackRes.data.globalStats || {});

      setRecentFeedbacks(
        (feedbackList.data.feedbacks || []).slice(0, 3)
      );
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 REGISTRATION STATS
  const approved = registrations.filter((r) => r.status === "approved").length;
  const pending = registrations.filter((r) => r.status === "pending").length;
  const rejected = registrations.filter((r) => r.status === "rejected").length;

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
              {[
                {
                  label: "Total Events",
                  value: events.length,
                  icon: <FaTicketAlt />,
                  color: "from-purple-500 to-indigo-600",
                },
                {
                  label: "Feedbacks",
                  value: feedbackStats.totalFeedbacks || 0,
                  icon: <FaStar />,
                  color: "from-pink-500 to-rose-600",
                },
                {
                  label: "Avg Rating",
                  value: feedbackStats.globalAvg || "0",
                  icon: <FaCheckCircle />,
                  color: "from-green-500 to-emerald-600",
                },
                {
                  label: "Participants",
                  value: events.reduce(
                    (sum, e) => sum + (e.current_participants || 0),
                    0
                  ),
                  icon: <FaUsers />,
                  color: "from-orange-400 to-pink-500",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow flex items-center gap-4"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-purple-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-purple-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/admin/dashboard/create-event"
                className="bg-purple-600 text-white p-5 rounded-2xl text-center shadow hover:scale-105 transition"
              >
                <FaPlus className="mx-auto mb-2" />
                Create Event
              </Link>

              <Link
                to="/admin/dashboard/events"
                className="bg-indigo-600 text-white p-5 rounded-2xl text-center shadow hover:scale-105 transition"
              >
                Manage Events
              </Link>

              <Link
                to="/admin/feedback-analytics"
                className="bg-pink-600 text-white p-5 rounded-2xl text-center shadow hover:scale-105 transition"
              >
                <FaStar className="mx-auto mb-2" />
                Feedback Analytics
              </Link>

              <Link
                to="/admin/dashboard/events"
                className="bg-green-600 text-white p-5 rounded-2xl text-center shadow hover:scale-105 transition"
              >
                Registrations
              </Link>
            </div>

            {/* RECENT EVENTS */}
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-bold text-purple-900 text-lg">
                  Latest Events
                </h2>
                <Link to="/admin/dashboard/events" className="text-purple-600">
                  View All →
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {events.slice(0, 2).map((event) => (
                  <div
                    key={event._id}
                    className="bg-white/90 p-5 rounded-2xl shadow hover:shadow-xl transition"
                  >
                    <h3 className="font-bold text-purple-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-purple-500 mt-1">
                      📍 {event.location}
                    </p>

                    <Link
                      to={`/admin/dashboard/events/${event._id}`}
                      className="block mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2 rounded-xl"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
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