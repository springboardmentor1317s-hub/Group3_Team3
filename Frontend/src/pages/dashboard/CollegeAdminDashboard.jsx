import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaPlus,
  FaArrowRight,
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

function CollegeAdminDashboard() {
  const user = getUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: no /registrations/pending endpoint exists
  // Instead we fetch registrations per event and filter pending ones
  const fetchPendingRegistrations = async () => {
    try {
      setPendingLoading(true);
      const eventsRes = await api.get("/events");
      const allEvents = eventsRes.data.events || [];

      const allPending = [];
      await Promise.all(
        allEvents.map(async (event) => {
          try {
            const regRes = await api.get(`/registrations/event/${event._id}`);
            const regs = regRes.data.registrations || [];
            regs
              .filter((r) => r.status === "pending")
              .forEach((r) => {
                allPending.push({
                  ...r,
                  eventTitle: event.title,
                  studentName: r.user_id?.name || "Unknown",
                  email: r.user_id?.email || "",
                });
              });
          } catch (_) {}
        }),
      );
      setPendingRegistrations(allPending);
    } catch (err) {
      console.error("Error fetching pending registrations:", err);
      toast.error("Failed to load pending registrations");
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchPendingRegistrations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  // ✅ FIXED: was PUT /registrations/:id/approve
  const handleApprove = async (registrationId) => {
    try {
      await api.put(`/registrations/${registrationId}/status`, {
        status: "approved",
      });
      toast.success("✅ Approved! Student notified.");
      fetchPendingRegistrations();
    } catch (err) {
      toast.error("❌ Approve failed!");
      console.error(err);
    }
  };

  // ✅ FIXED: was PUT /registrations/:id/reject
  const handleReject = async (registrationId) => {
    try {
      await api.put(`/registrations/${registrationId}/status`, {
        status: "rejected",
      });
      toast.success("Rejected. Student notified.");
      fetchPendingRegistrations();
    } catch (err) {
      toast.error("❌ Reject failed!");
      console.error(err);
    }
  };

  const published = events.filter((e) => e.status === "published").length;
  const totalParticipants = events.reduce(
    (sum, e) => sum + (e.current_participants || 0),
    0,
  );

  const stats = [
    {
      label: "Total Events",
      value: events.length,
      icon: <FaCalendarAlt />,
      color: "from-indigo-500 to-purple-600",
    },
    {
      label: "Published",
      value: published,
      icon: <FaCheckCircle />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Total Participants",
      value: totalParticipants,
      icon: <FaUsers />,
      color: "from-orange-400 to-pink-500",
    },
    {
      label: "Pending Approvals",
      value: pendingRegistrations.length,
      icon: <FaSpinner />,
      color: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-800">
                Event Organizer Dashboard
              </h1>
              <p className="text-slate-500 mt-1">
                Welcome back, {user?.name?.split(" ")[0] || "Admin"}
              </p>
            </div>
            <Link
              to="/admin/dashboard/create-event"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <FaPlus /> Create Event
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-all`}
                >
                  {s.icon}
                </div>
                <p className="text-3xl font-black text-slate-900 mb-1">
                  {s.value}
                </p>
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Link
              to="/admin/dashboard/create-event"
              className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              <span className="flex items-center gap-3">
                <FaPlus className="text-2xl" /> Create New Event
              </span>
              <FaArrowRight className="text-xl" />
            </Link>
            <Link
              to="/admin/dashboard/events"
              className="flex items-center justify-between p-6 bg-white border-2 border-indigo-200 text-indigo-700 rounded-3xl font-bold shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all"
            >
              <span className="flex items-center gap-3">
                <FaEye className="text-xl" /> View All Events
              </span>
              <FaArrowRight className="text-xl" />
            </Link>
            <Link
              to="/admin/dashboard/events"
              className="flex items-center justify-between p-6 bg-white border-2 border-emerald-200 text-emerald-700 rounded-3xl font-bold shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all"
            >
              <span className="flex items-center gap-3">
                <FaUsers className="text-xl" /> Manage Registrations
              </span>
              <FaArrowRight className="text-xl" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pending Approvals */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <FaSpinner className="text-yellow-500 animate-spin" /> Pending
                  Approvals
                </h2>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl text-sm font-bold">
                  {pendingRegistrations.length}
                </span>
              </div>

              {pendingLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-slate-100 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : pendingRegistrations.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <FaCheckCircle className="text-6xl mx-auto mb-4 opacity-40" />
                  <h3 className="text-xl font-bold mb-1">All clear!</h3>
                  <p className="text-sm">No pending approvals right now</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pendingRegistrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:shadow-md bg-gradient-to-r from-slate-50 to-yellow-50 transition-all gap-3"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {reg.studentName}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {reg.eventTitle}
                        </p>
                        <p className="text-xs text-slate-500">{reg.email}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApprove(reg._id)}
                          className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-all"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(reg._id)}
                          className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition-all"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-900">
                  Recent Events
                </h2>
                <Link
                  to="/admin/dashboard/events"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  View All →
                </Link>
              </div>

              {loading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-slate-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <FaCalendarAlt className="text-6xl mx-auto mb-6 opacity-40" />
                  <p className="text-xl font-bold mb-4">No events yet</p>
                  <Link
                    to="/admin/dashboard/create-event"
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all"
                  >
                    Create First Event
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {events.slice(0, 6).map((event) => (
                    <div
                      key={event._id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-all"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {event.title}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {event.category} •{" "}
                          {new Date(event.start_date).toLocaleDateString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            event.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : event.status === "draft"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {event.status}
                        </span>
                        <Link
                          to={`/admin/dashboard/events/${event._id}`}
                          className="p-2 hover:bg-indigo-100 rounded-xl text-indigo-600 transition-all"
                        >
                          <FaEdit />
                        </Link>
                        <Link
                          to={`/admin/dashboard/events/${event._id}/registrations`}
                          className="p-2 hover:bg-emerald-100 rounded-xl text-emerald-600 transition-all"
                        >
                          <FaUsers />
                        </Link>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-2 hover:bg-red-100 rounded-xl text-red-500 transition-all"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CollegeAdminDashboard;