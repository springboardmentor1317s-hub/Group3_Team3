import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { FaBell, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Derive notifications from the student's registration statuses
        const res = await api.get("/registrations/my");
        const registrations = res.data.registrations || [];
        const mapped = registrations.map((reg) => ({
          id: reg._id,
          message: buildMessage(reg),
          type: reg.status,
          time: new Date(reg.timestamp).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          eventTitle: reg.event_id?.title || "Event",
        }));
        setNotifications(mapped);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  function buildMessage(reg) {
    const title = reg.event_id?.title || "Event";
    if (reg.status === "approved") return `🎉 ${title} registration APPROVED!`;
    if (reg.status === "rejected") return `❌ ${title} registration REJECTED`;
    return `⏳ ${title} — Pending college approval`;
  }

  const cardStyle = {
    approved: "bg-emerald-50 border-emerald-200",
    pending: "bg-amber-50 border-amber-200",
    rejected: "bg-red-50 border-red-200",
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
          <div className="max-w-4xl mx-auto animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaBell className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">
                Notifications
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Your registration updates
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="mb-8 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-semibold text-emerald-800">
                  {notifications.length} registration update
                  {notifications.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}

          {/* List */}
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-6 rounded-3xl shadow-md border transition-all hover:shadow-xl hover:-translate-y-0.5 ${cardStyle[n.type] || "bg-slate-50 border-slate-200"}`}
              >
                <div className="flex items-start gap-4">
                  {n.type === "approved" && (
                    <FaCheckCircle className="text-emerald-500 text-2xl mt-0.5 flex-shrink-0" />
                  )}
                  {n.type === "pending" && (
                    <FaClock className="text-amber-500   text-2xl mt-0.5 flex-shrink-0" />
                  )}
                  {n.type === "rejected" && (
                    <FaTimesCircle className="text-red-500      text-2xl mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900 leading-snug">
                      {n.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span>{n.time}</span>
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      <Link
                        to="/student/registrations"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View registrations →
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <FaBell className="text-6xl mx-auto mb-6 opacity-40" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-600">
                No notifications yet
              </h3>
              <p className="text-lg">Register for events to see updates here</p>
              <Link
                to="/student/events"
                className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentNotifications;