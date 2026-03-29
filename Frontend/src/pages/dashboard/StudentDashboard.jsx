// src/pages/dashboard/StudentDashboard.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaTicketAlt,
} from "react-icons/fa";

function StudentDashboard() {
  const user = getUser();


  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const [regRes, notifRes, eventRes] = await Promise.all([
        api.get("/registrations/my"),
        api.get("/notifications"),
        api.get("/events"),
      ]);

        console.log("REG:", regRes.data);
        console.log("NOTIF:", notifRes.data);
        console.log("EVENT:", eventRes.data);

      setRegistrations(regRes.data.registrations || regRes.data || []);
      setNotifications(notifRes.data.notifications || notifRes.data || []);

      // ✅ SORT EVENTS (LATEST FIRST)
      const eventsData = eventRes.data.events || eventRes.data || [];

      const sortedEvents = eventsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setEvents(sortedEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 🔥 REALTIME (Polling)
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const approved = registrations.filter((r) => r.status === "approved").length;
  const pending = registrations.filter((r) => r.status === "pending").length;
  const rejected = registrations.filter((r) => r.status === "rejected").length;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-purple-200 p-6">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-3 space-y-6">

            {/* HEADER */}
            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow flex justify-between">
              <div>
                <h1 className="text-2xl font-bold text-purple-900">
                  Welcome, {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-purple-500">{user?.college}</p>
              </div>
              <FaBell className="text-purple-600 text-xl" />
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total",
                  value: registrations.length,
                  icon: <FaTicketAlt />,
                  color: "from-purple-500 to-indigo-600",
                },
                {
                  label: "Approved",
                  value: approved,
                  icon: <FaCheckCircle />,
                  color: "from-green-500 to-emerald-600",
                },
                {
                  label: "Pending",
                  value: pending,
                  icon: <FaClock />,
                  color: "from-yellow-500 to-orange-500",
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

            {/* 🔥 RECENT REGISTRATIONS (NEW UI) */}
            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold text-purple-900">
                  Recent Registrations
                </h2>
                <Link to="/student/registrations" className="text-purple-600">
                  View All →
                </Link>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : registrations.length === 0 ? (
                <p className="text-purple-400 text-center">
                  No registrations yet
                </p>
              ) : (
                <div className="space-y-3">
                  {registrations.slice(0, 5).map((reg) => {
                    const event = reg.event_id || {};

                    return (
                      <div
                        key={reg._id}
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-purple-50 rounded-xl shadow hover:shadow-md transition"
                      >
                        <div>
                          <p className="font-semibold text-purple-900">
                            {reg.event_id?.title || "No Event"}
                          </p>
                          <p className="text-sm text-purple-500">
                            {event.location}
                          </p>
                        </div>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            reg.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : reg.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {reg.status === "approved"
                            ? "Approved"
                            : reg.status === "pending"
                            ? "Pending"
                            : "Rejected"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 🔥 RECENT EVENTS (ONLY LAST 2) */}
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-bold text-purple-900 text-lg">
                  Latest Events
                </h2>
                <Link to="/student/events" className="text-purple-600">
                  View All →
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {events.slice(0, 2).map((event) => (
                  <div
                    key={event._id}
                    className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow hover:shadow-xl transition"
                  >
                    <h3 className="font-bold text-purple-900">
                      {event.title}
                    </h3>
                    <p className="text-sm text-purple-500 mt-1">
                      📍 {event.location}
                    </p>

                    {event?._id && (
                      <Link
                        to={`/student/events/${event._id}`}
                        className="block mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-2 rounded-xl"
                      >
                        View Details
                      </Link>
                    )}

                   
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">

            {/* PROFILE */}
            <div
          onClick={() => navigate("/student/profile")}
          className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-5 rounded-2xl text-center shadow cursor-pointer hover:scale-105 transition"
        >
          <FaUser className="text-3xl mx-auto mb-2" />
          <h3>{user?.name}</h3>
          <p className="text-sm opacity-80">{user?.college}</p>

          <p className="text-xs mt-2 opacity-80">Click to edit profile ✏️</p>
        </div>

            {/* ACTIONS */}
            <Link
              to="/student/events"
              className="block bg-purple-600 text-white p-4 rounded-xl text-center"
            >
              Events
            </Link>

            <Link
              to="/student/registrations"
              className="block bg-indigo-700 text-white p-4 rounded-xl text-center"
            >
              My Registrations
            </Link>

            {/* 🔔 NOTIFICATIONS (REALTIME) */}
            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow">
              <h3 className="font-bold text-purple-900 mb-2">
                Notifications
              </h3>

              {notifications.length === 0 ? (
                <p className="text-purple-400 text-sm">No updates</p>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n._id}
                    className="text-sm text-purple-700 bg-purple-50 p-2 rounded mb-2"
                  >
                    🔔 {n.message}
                  </div>
                ))
              )}
            </div>

            {/* EXTRA */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 rounded-2xl shadow">
              <h3 className="font-bold">Stay Active 🚀</h3>
              <p className="text-sm mt-1">
                Participate in events and boost your profile
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;