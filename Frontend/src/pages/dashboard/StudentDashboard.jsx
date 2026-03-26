import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt, FaTicketAlt, FaBell, FaUser,
  FaCheckCircle, FaClock, FaTimesCircle, FaArrowRight,
  FaSearch, FaStar, FaMapMarkerAlt, FaFire,
} from "react-icons/fa";

const statusConfig = {
  approved: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "✅", label: "Approved" },
  pending:  { bg: "bg-amber-100",   text: "text-amber-700",   icon: "⏳", label: "Pending" },
  rejected: { bg: "bg-red-100",     text: "text-red-700",     icon: "❌", label: "Rejected" },
};

function StudentDashboard() {
  const user = getUser();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    api.get("/registrations/my")
      .then((res) => setRegistrations(res.data.registrations || []))
      .catch(console.error)
      .finally(() => setLoading(false));

    api.get("/events")
      .then((res) => {
        const all = res.data.events || [];
        const upcoming = all.filter((e) => e.status === "published").slice(0, 6);
        setUpcomingEvents(upcoming);
      })
      .catch(console.error)
      .finally(() => setEventsLoading(false));
  }, []);

  const approved = registrations.filter((r) => r.status === "approved");
  const pending  = registrations.filter((r) => r.status === "pending");
  const rejected = registrations.filter((r) => r.status === "rejected");

  const stats = [
    { label: "Total Registered",  value: registrations.length, icon: <FaTicketAlt />,   color: "from-indigo-500 to-purple-600",  bg: "bg-indigo-50" },
    { label: "Approved",          value: approved.length,      icon: <FaCheckCircle />, color: "from-emerald-500 to-teal-600",   bg: "bg-emerald-50" },
    { label: "Pending Review",    value: pending.length,       icon: <FaClock />,       color: "from-amber-500 to-orange-500",   bg: "bg-amber-50" },
    { label: "Rejected",          value: rejected.length,      icon: <FaTimesCircle />, color: "from-red-500 to-rose-600",       bg: "bg-red-50" },
  ];

  const tabs = [
    { id: "overview",      label: "Overview" },
    { id: "registrations", label: `My Registrations (${registrations.length})` },
    { id: "notifications", label: `Notifications ${pending.length > 0 ? `(${pending.length})` : ""}` },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

        {/* Header banner */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center font-black text-2xl">
                  {user?.name?.[0]?.toUpperCase() || "S"}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black">Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋</h1>
                  <p className="text-indigo-200 text-sm mt-0.5">{user?.college} • Student</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {pending.length > 0 && (
                  <div className="flex items-center gap-2 bg-amber-400/20 border border-amber-300/40 px-4 py-2 rounded-xl text-amber-100 text-sm font-bold">
                    <FaClock className="animate-pulse" /> {pending.length} pending approval{pending.length !== 1 ? "s" : ""}
                  </div>
                )}
                <Link to="/student/events"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:-translate-y-0.5 transition-all no-underline shadow-lg">
                  <FaSearch /> Browse Events
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-0">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-5 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === t.id ? "bg-slate-50 text-indigo-700" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* ── OVERVIEW ───────────────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-3xl p-5 border border-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                    <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-white mb-3 shadow`}>
                      {s.icon}
                    </div>
                    <p className="text-3xl font-black text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent registrations */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow border border-slate-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <FaTicketAlt className="text-indigo-500" /> Recent Registrations
                    </h2>
                    <button onClick={() => setActiveTab("registrations")} className="text-indigo-600 font-bold text-sm hover:underline">
                      View All →
                    </button>
                  </div>
                  {loading ? (
                    <div className="p-6 space-y-3">
                      {[1,2,3].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />)}
                    </div>
                  ) : registrations.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-4xl mb-3">📋</div>
                      <p className="font-bold text-slate-600 mb-1">No registrations yet</p>
                      <p className="text-slate-400 text-sm mb-4">Start exploring events and register!</p>
                      <Link to="/student/events" className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm no-underline hover:bg-indigo-700">
                        Browse Events
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {registrations.slice(0, 5).map((reg) => {
                        const event = reg.event_id || {};
                        const sc = statusConfig[reg.status] || statusConfig.pending;
                        return (
                          <div key={reg._id} className="px-6 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaCalendarAlt className="text-indigo-500 text-sm" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">{event.title || "Event"}</p>
                                <p className="text-xs text-slate-400 truncate capitalize">
                                  {event.category} {event.location ? `• ${event.location}` : ""}
                                </p>
                              </div>
                            </div>
                            <span className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-black ${sc.bg} ${sc.text}`}>
                              {sc.icon} {sc.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick links + Notification summary */}
                <div className="space-y-4">
                  {/* Quick actions */}
                  <div className="bg-white rounded-3xl p-5 shadow border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-4 text-sm uppercase tracking-wide">Quick Actions</h3>
                    <div className="space-y-2">
                      {[
                        { to: "/student/events",        icon: <FaSearch />,        label: "Browse Events",     color: "text-indigo-600 bg-indigo-50" },
                        { to: "/student/registrations", icon: <FaTicketAlt />,     label: "My Registrations",  color: "text-emerald-600 bg-emerald-50" },
                        { to: "/student/notifications", icon: <FaBell />,          label: "Notifications",     color: "text-amber-600 bg-amber-50" },
                        { to: "/student/profile",       icon: <FaUser />,          label: "My Profile",        color: "text-purple-600 bg-purple-50" },
                      ].map((a, i) => (
                        <Link key={i} to={a.to}
                          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors no-underline group">
                          <div className={`w-9 h-9 ${a.color} rounded-xl flex items-center justify-center text-sm`}>{a.icon}</div>
                          <span className="font-bold text-slate-700 text-sm">{a.label}</span>
                          <FaArrowRight className="ml-auto text-slate-300 group-hover:text-indigo-400 transition-colors text-xs" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Notification summary */}
                  {pending.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <FaClock className="text-amber-500 animate-pulse" />
                        <span className="font-black text-amber-800 text-sm">Awaiting Approval</span>
                      </div>
                      {pending.slice(0, 3).map((reg) => (
                        <div key={reg._id} className="text-xs text-amber-700 py-1.5 border-b border-amber-100 last:border-0 truncate">
                          📋 {reg.event_id?.title || "Event"}
                        </div>
                      ))}
                      <button onClick={() => setActiveTab("notifications")} className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-900">
                        View all →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming events */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FaFire className="text-orange-500" /> Upcoming Events
                  </h2>
                  <Link to="/student/events" className="text-indigo-600 font-bold text-sm hover:underline no-underline">
                    View All →
                  </Link>
                </div>
                {eventsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1,2,3].map((i) => <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingEvents.map((event) => (
                      <Link key={event._id} to={`/events/${event._id}`}
                        className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all no-underline group">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg capitalize">{event.category}</span>
                          <span className="text-xs text-slate-400">{event.current_participants || 0}/{event.max_participants}</span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm mb-1 group-hover:text-indigo-700 transition-colors line-clamp-2">{event.title}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                          <FaMapMarkerAlt className="text-indigo-300" />{event.location}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── REGISTRATIONS TAB ──────────────────────────────────── */}
          {activeTab === "registrations" && (
            <div className="bg-white rounded-3xl shadow border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900">My Registrations</h2>
                <p className="text-slate-400 text-sm mt-0.5">{registrations.length} total registrations</p>
              </div>
              {loading ? (
                <div className="p-6 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
              ) : registrations.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="text-5xl mb-3">📋</div>
                  <p className="font-black text-slate-700 mb-4">No registrations yet</p>
                  <Link to="/student/events" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl no-underline hover:bg-indigo-700 text-sm">Browse Events</Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {registrations.map((reg) => {
                    const event = reg.event_id || {};
                    const sc = statusConfig[reg.status] || statusConfig.pending;
                    return (
                      <div key={reg._id} className="px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`w-12 h-12 ${sc.bg} rounded-2xl flex items-center justify-center text-xl flex-shrink-0`}>
                            {sc.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-slate-900 truncate">{event.title || "Event"}</p>
                            <p className="text-sm text-slate-500 capitalize truncate">
                              {event.category} {event.location ? `• ${event.location}` : ""}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              Registered {reg.timestamp ? new Date(reg.timestamp).toLocaleDateString("en-IN") : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`px-4 py-2 rounded-xl text-sm font-black ${sc.bg} ${sc.text}`}>
                            {sc.icon} {sc.label}
                          </span>
                          {event._id && (
                            <Link to={`/events/${event._id}`}
                              className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors no-underline">
                              <FaArrowRight className="text-xs" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ──────────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl shadow border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FaBell className="text-indigo-500" /> Notifications
                  </h2>
                  <span className="text-sm text-slate-400 font-semibold">{registrations.length} updates</span>
                </div>
                {loading ? (
                  <div className="p-6 space-y-3">{[1,2,3].map((i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
                ) : registrations.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="text-5xl mb-3">🔔</div>
                    <p className="font-black text-slate-700 mb-2">No notifications yet</p>
                    <p className="text-slate-400 text-sm">Register for events to receive updates here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {registrations.map((reg) => {
                      const event = reg.event_id || {};
                      const sc = statusConfig[reg.status] || statusConfig.pending;
                      const msg = reg.status === "approved"
                        ? `🎉 Your registration for "${event.title}" was APPROVED!`
                        : reg.status === "rejected"
                        ? `❌ Your registration for "${event.title}" was rejected.`
                        : `⏳ Your registration for "${event.title}" is pending admin review.`;

                      return (
                        <div key={reg._id} className={`px-6 py-5 flex items-start gap-4 hover:bg-slate-50 transition-colors ${reg.status === "approved" ? "border-l-4 border-emerald-400" : reg.status === "rejected" ? "border-l-4 border-red-400" : "border-l-4 border-amber-400"}`}>
                          <div className={`w-11 h-11 ${sc.bg} rounded-2xl flex items-center justify-center text-lg flex-shrink-0`}>
                            {sc.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm leading-snug">{msg}</p>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${sc.bg} ${sc.text}`}>{sc.label}</span>
                              {event.category && <span className="text-xs text-slate-400 capitalize">{event.category}</span>}
                              {reg.timestamp && <span className="text-xs text-slate-400">{new Date(reg.timestamp).toLocaleDateString("en-IN")}</span>}
                            </div>
                          </div>
                          {event._id && (
                            <Link to={`/events/${event._id}`} className="flex-shrink-0 text-indigo-400 hover:text-indigo-600 no-underline">
                              <FaArrowRight className="text-sm" />
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;