import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt, FaUsers, FaCheckCircle, FaPlus,
  FaArrowRight, FaEye, FaEdit, FaTrash, FaSpinner,
  FaBell, FaChartBar, FaFilter, FaSearch, FaClock,
  FaTimesCircle, FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-toastify";

function StatCard({ label, value, icon, color, sub, onClick }) {
  return (
    <div onClick={onClick}
      className={`bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all group ${onClick ? "cursor-pointer" : ""}`}>
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-all`}>
        {icon}
      </div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function CollegeAdminDashboard() {
  const user = getUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [regFilter, setRegFilter] = useState("pending");
  const [searchReg, setSearchReg] = useState("");
  const [processingId, setProcessingId] = useState(null);

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

  const fetchAllRegistrations = async () => {
    try {
      setPendingLoading(true);
      const eventsRes = await api.get("/events");
      const allEvents = eventsRes.data.events || [];
      const allRegs = [];
      await Promise.all(
        allEvents.map(async (event) => {
          try {
            const regRes = await api.get(`/registrations/event/${event._id}`);
            const regs = regRes.data.registrations || [];
            regs.forEach((r) => {
              allRegs.push({
                ...r,
                eventTitle: event.title,
                eventCategory: event.category,
                studentName: r.user_id?.name || "Unknown",
                studentEmail: r.user_id?.email || "",
                studentCollege: r.user_id?.college || "",
              });
            });
          } catch (_) {}
        })
      );
      setAllRegistrations(allRegs);
      setPendingRegistrations(allRegs.filter((r) => r.status === "pending"));
    } catch (err) {
      toast.error("Failed to load registrations");
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchAllRegistrations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const handleUpdateStatus = async (registrationId, status) => {
    setProcessingId(registrationId);
    try {
      await api.put(`/registrations/${registrationId}/status`, { status });
      toast.success(status === "approved" ? "✅ Registration approved! Student notified." : "Registration rejected. Student notified.");
      fetchAllRegistrations();
    } catch (err) {
      toast.error(`Failed to ${status} registration`);
    } finally {
      setProcessingId(null);
    }
  };

  const published = events.filter((e) => e.status === "published").length;
  const totalParticipants = events.reduce((sum, e) => sum + (e.current_participants || 0), 0);

  const filteredRegs = allRegistrations.filter((r) => {
    const matchStatus = regFilter === "all" || r.status === regFilter;
    const q = searchReg.toLowerCase();
    const matchSearch = !q || r.studentName?.toLowerCase().includes(q) || r.eventTitle?.toLowerCase().includes(q) || r.studentEmail?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const tabs = [
    { id: "overview",      label: "Overview" },
    { id: "registrations", label: `Registrations ${pendingRegistrations.length > 0 ? `(${pendingRegistrations.length} pending)` : ""}` },
    { id: "events",        label: "My Events" },
  ];

  const statusConfig = {
    pending:  { bg: "bg-amber-100",  text: "text-amber-700",  label: "Pending",  icon: "⏳" },
    approved: { bg: "bg-emerald-100",text: "text-emerald-700",label: "Approved", icon: "✅" },
    rejected: { bg: "bg-red-100",    text: "text-red-700",    label: "Rejected", icon: "❌" },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black">Event Organizer Dashboard</h1>
                <p className="text-slate-400 text-sm mt-0.5">Welcome back, {user?.name?.split(" ")[0] || "Admin"} • {user?.college}</p>
              </div>
              <div className="flex items-center gap-3">
                {pendingRegistrations.length > 0 && (
                  <button onClick={() => { setActiveTab("registrations"); setRegFilter("pending"); }}
                    className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 px-4 py-2 rounded-xl text-amber-200 text-sm font-bold hover:bg-amber-500/30 transition-colors">
                    <FaBell className="animate-bounce" />
                    {pendingRegistrations.length} pending review
                  </button>
                )}
                <Link to="/admin/dashboard/create-event"
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white font-bold rounded-xl text-sm hover:bg-indigo-600 hover:-translate-y-0.5 transition-all no-underline shadow-lg">
                  <FaPlus /> Create Event
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-6 flex gap-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-5 py-3 font-bold text-sm rounded-t-xl transition-all ${activeTab === t.id ? "bg-slate-50 text-slate-900" : "text-slate-400 hover:text-white hover:bg-white/10"}`}>
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
                <StatCard label="Total Events" value={events.length} icon={<FaCalendarAlt />} color="from-indigo-500 to-purple-600" />
                <StatCard label="Published" value={published} icon={<FaCheckCircle />} color="from-emerald-500 to-teal-600" />
                <StatCard label="Participants" value={totalParticipants} icon={<FaUsers />} color="from-orange-400 to-pink-500" />
                <StatCard
                  label="Pending Approvals"
                  value={pendingRegistrations.length}
                  icon={<FaSpinner className={pendingRegistrations.length > 0 ? "animate-spin" : ""} />}
                  color="from-yellow-400 to-orange-500"
                  sub={pendingRegistrations.length > 0 ? "Click to review" : "All clear!"}
                  onClick={() => { setActiveTab("registrations"); setRegFilter("pending"); }}
                />
              </div>

              {/* Main grid */}
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Pending Registrations - large */}
                <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      {pendingRegistrations.length > 0
                        ? <FaBell className="text-amber-500 animate-bounce" />
                        : <FaCheckCircle className="text-emerald-500" />}
                      Pending Approvals
                      {pendingRegistrations.length > 0 && (
                        <span className="ml-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-black">
                          {pendingRegistrations.length}
                        </span>
                      )}
                    </h2>
                    <button onClick={() => { setActiveTab("registrations"); setRegFilter("pending"); }}
                      className="text-indigo-600 font-bold text-sm hover:underline">
                      View All →
                    </button>
                  </div>

                  {pendingLoading ? (
                    <div className="p-6 space-y-3">{[1,2,3].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
                  ) : pendingRegistrations.length === 0 ? (
                    <div className="p-14 text-center">
                      <FaCheckCircle className="text-5xl text-emerald-300 mx-auto mb-4" />
                      <p className="font-black text-slate-700 mb-1">All clear!</p>
                      <p className="text-slate-400 text-sm">No pending approvals right now</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                      {pendingRegistrations.slice(0, 8).map((reg) => (
                        <div key={reg._id} className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-amber-50/50 transition-colors">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-700 text-sm flex-shrink-0">
                              {reg.studentName?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-900 text-sm truncate">{reg.studentName}</p>
                              <p className="text-xs text-slate-500 truncate">{reg.eventTitle}</p>
                              {reg.studentEmail && <p className="text-xs text-slate-400 truncate">{reg.studentEmail}</p>}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleUpdateStatus(reg._id, "approved")}
                              disabled={processingId === reg._id}
                              className="px-3 py-1.5 bg-emerald-500 text-white font-bold rounded-xl text-xs hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center gap-1">
                              {processingId === reg._id ? <FaSpinner className="animate-spin" /> : "✅"} Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(reg._id, "rejected")}
                              disabled={processingId === reg._id}
                              className="px-3 py-1.5 bg-red-500 text-white font-bold rounded-xl text-xs hover:bg-red-600 transition-all disabled:opacity-50">
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions + Recent events small */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-4 text-sm uppercase tracking-wide">Quick Actions</h3>
                    <div className="space-y-2">
                      {[
                        { to: "/admin/dashboard/create-event", icon: <FaPlus />, label: "Create New Event", color: "bg-indigo-600 text-white" },
                        { to: "/admin/dashboard/events", icon: <FaEye />, label: "View All Events", color: "bg-slate-100 text-slate-700" },
                        { to: "/admin/feedback-analytics", icon: <FaChartBar />, label: "Feedback Analytics", color: "bg-slate-100 text-slate-700" },
                      ].map((a, i) => (
                        <Link key={i} to={a.to}
                          className={`flex items-center gap-3 p-3 rounded-2xl font-bold text-sm transition-all no-underline hover:-translate-y-0.5 ${a.color}`}>
                          {a.icon} {a.label}
                          <FaArrowRight className="ml-auto text-xs opacity-60" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Registration summary */}
                  <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-4 text-sm uppercase tracking-wide">Registration Summary</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Pending", count: allRegistrations.filter((r) => r.status === "pending").length, color: "bg-amber-400", text: "text-amber-700 bg-amber-50" },
                        { label: "Approved", count: allRegistrations.filter((r) => r.status === "approved").length, color: "bg-emerald-400", text: "text-emerald-700 bg-emerald-50" },
                        { label: "Rejected", count: allRegistrations.filter((r) => r.status === "rejected").length, color: "bg-red-400", text: "text-red-700 bg-red-50" },
                      ].map((s, i) => {
                        const total = allRegistrations.length;
                        const pct = total > 0 ? (s.count / total) * 100 : 0;
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-600">{s.label}</span>
                              <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${s.text}`}>{s.count}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full">
                              <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── REGISTRATIONS TAB ──────────────────────────────────── */}
          {activeTab === "registrations" && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="bg-white rounded-2xl shadow border border-slate-100 p-4 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input type="text" placeholder="Search by student or event..."
                    value={searchReg} onChange={(e) => setSearchReg(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none" />
                </div>
                <div className="flex gap-2">
                  {["all","pending","approved","rejected"].map((f) => (
                    <button key={f} onClick={() => setRegFilter(f)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${regFilter === f
                        ? f === "pending" ? "bg-amber-500 text-white" : f === "approved" ? "bg-emerald-500 text-white" : f === "rejected" ? "bg-red-500 text-white" : "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {f} {f !== "all" && `(${allRegistrations.filter((r) => r.status === f).length})`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-900">
                    {regFilter === "all" ? "All" : regFilter.charAt(0).toUpperCase() + regFilter.slice(1)} Registrations
                    <span className="ml-2 text-slate-400 font-bold">({filteredRegs.length})</span>
                  </h2>
                </div>

                {pendingLoading ? (
                  <div className="p-6 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
                ) : filteredRegs.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="text-5xl mb-3">📋</div>
                    <p className="font-black text-slate-700">No {regFilter} registrations</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {filteredRegs.map((reg) => {
                      const sc = statusConfig[reg.status] || statusConfig.pending;
                      return (
                        <div key={reg._id} className={`px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors ${reg.status === "pending" ? "border-l-4 border-amber-400" : reg.status === "approved" ? "border-l-4 border-emerald-400" : "border-l-4 border-red-400"}`}>
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-11 h-11 bg-indigo-100 rounded-2xl flex items-center justify-center font-black text-indigo-700 flex-shrink-0">
                              {reg.studentName?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-900 truncate">{reg.studentName}</p>
                              <p className="text-sm text-slate-500 truncate">{reg.eventTitle}</p>
                              <div className="flex items-center gap-3 mt-0.5">
                                {reg.studentEmail && <span className="text-xs text-slate-400 flex items-center gap-1"><FaEnvelope className="text-slate-300" />{reg.studentEmail}</span>}
                                {reg.studentCollege && <span className="text-xs text-slate-400">{reg.studentCollege}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`px-3 py-1.5 rounded-xl text-xs font-black ${sc.bg} ${sc.text}`}>{sc.icon} {sc.label}</span>
                            {reg.status === "pending" && (
                              <>
                                <button onClick={() => handleUpdateStatus(reg._id, "approved")}
                                  disabled={processingId === reg._id}
                                  className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-xs hover:bg-emerald-600 transition-all disabled:opacity-50">
                                  {processingId === reg._id ? <FaSpinner className="animate-spin" /> : "✅ Approve"}
                                </button>
                                <button onClick={() => handleUpdateStatus(reg._id, "rejected")}
                                  disabled={processingId === reg._id}
                                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl text-xs hover:bg-red-600 transition-all disabled:opacity-50">
                                  ❌ Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── EVENTS TAB ─────────────────────────────────────────── */}
          {activeTab === "events" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900">My Events ({events.length})</h2>
                <Link to="/admin/dashboard/create-event"
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors no-underline">
                  <FaPlus /> Create Event
                </Link>
              </div>

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1,2,3].map((i) => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-slate-100" />)}
                </div>
              ) : events.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center shadow border border-slate-100">
                  <FaCalendarAlt className="text-5xl text-slate-200 mx-auto mb-4" />
                  <p className="font-black text-slate-700 mb-4">No events yet</p>
                  <Link to="/admin/dashboard/create-event"
                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm no-underline hover:bg-indigo-700">
                    Create First Event
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <div key={event._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                      <div className={`h-2 ${event.status === "published" ? "bg-emerald-400" : event.status === "completed" ? "bg-slate-400" : "bg-amber-400"}`} />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-black text-slate-900 text-base line-clamp-2 group-hover:text-indigo-700 transition-colors">{event.title}</h3>
                          <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
                            event.status === "published" ? "bg-emerald-100 text-emerald-700" :
                            event.status === "completed" ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-700"
                          }`}>{event.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 capitalize mb-3">{event.category} • {new Date(event.start_date).toLocaleDateString("en-IN")}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                          <span className="flex items-center gap-1"><FaUsers className="text-indigo-300" />{event.current_participants || 0}/{event.max_participants}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full mb-4">
                          <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${Math.min(((event.current_participants || 0) / event.max_participants) * 100, 100)}%` }} />
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/dashboard/events/${event._id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-100 transition-colors no-underline">
                            <FaEdit /> Edit
                          </Link>
                          <Link to={`/admin/dashboard/events/${event._id}/registrations`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-xl text-xs hover:bg-emerald-100 transition-colors no-underline">
                            <FaUsers /> Regs
                          </Link>
                          <button onClick={() => handleDelete(event._id)}
                            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CollegeAdminDashboard;