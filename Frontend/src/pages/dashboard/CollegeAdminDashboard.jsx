import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt, FaUsers, FaCheckCircle, FaChartBar, FaPlus,
  FaArrowRight, FaEye, FaEdit, FaTrash, FaSpinner, FaBell
} from "react-icons/fa";
import { toast } from "react-toastify";

function CollegeAdminDashboard() {
  const user = getUser();
  
  // Existing states
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW: Pending Registrations State
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);

  // Existing fetchEvents
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

  // ✅ NEW: Fetch Pending Registrations
  const fetchPendingRegistrations = async () => {
    try {
      setPendingLoading(true);
      const res = await api.get("/registrations/pending");
      setPendingRegistrations(res.data.registrations || []);
    } catch (err) {
      console.error("Error fetching pending registrations:", err);
      toast.error("Failed to load pending registrations");
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchPendingRegistrations(); // ✅ NEW
  }, []);

  // Existing handleDelete
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

  // ✅ NEW: Approve Registration
  const handleApprove = async (registrationId) => {
    try {
      await api.put(`/registrations/${registrationId}/approve`);
      toast.success("✅ Approved! Student notified.");
      fetchPendingRegistrations(); // Refresh list
    } catch (err) {
      toast.error("❌ Approve failed!");
      console.error(err);
    }
  };

  // ✅ NEW: Reject Registration
  const handleReject = async (registrationId) => {
    try {
      await api.put(`/registrations/${registrationId}/reject`);
      toast.success("❌ Rejected! Student notified.");
      fetchPendingRegistrations(); // Refresh list
    } catch (err) {
      toast.error("❌ Reject failed!");
      console.error(err);
    }
  };

  // Stats calculations
  const published = events.filter((e) => e.status === "published").length;
  const totalParticipants = events.reduce(
    (sum, e) => sum + (e.current_participants || 0), 0
  );

  const stats = [
    { label: "Total Events", value: events.length, icon: <FaCalendarAlt />, color: "from-indigo-500 to-purple-600" },
    { label: "Published", value: published, icon: <FaCheckCircle />, color: "from-emerald-500 to-teal-600" },
    { label: "Total Registrations", value: totalParticipants, icon: <FaUsers />, color: "from-orange-400 to-pink-500" },
    { label: "Pending Approvals", value: pendingRegistrations.length, icon: <FaSpinner />, color: "from-yellow-400 to-orange-500" },
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
              <p className="text-slate-500 mt-1">Manage events & approve registrations</p>
            </div>
            <Link to="/admin/dashboard/create-event" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
              <FaPlus /> Create Event
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-all`}>
                  {s.icon}
                </div>
                <p className="text-3xl font-black text-slate-900 mb-2">{s.value}</p>
                <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link to="/admin/dashboard/create-event" className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl font-bold shadow-xl hover:shadow-2xl transition-all">
              <span className="flex items-center gap-3">
                <FaPlus className="text-2xl" /> Create New Event
              </span>
              <FaArrowRight className="text-xl" />
            </Link>
            <Link to="/admin/dashboard/events" className="flex items-center justify-between p-6 bg-white border-2 border-indigo-200 text-indigo-700 rounded-3xl font-bold shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all">
              <span className="flex items-center gap-3">
                <FaEye className="text-xl" /> View All Events
              </span>
              <FaArrowRight className="text-xl" />
            </Link>
            <Link to="/admin/dashboard/registrations" className="flex items-center justify-between p-6 bg-white border-2 border-emerald-200 text-emerald-700 rounded-3xl font-bold shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all">
              <span className="flex items-center gap-3">
                <FaUsers className="text-xl" /> All Registrations
              </span>
              <FaArrowRight className="text-xl" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ✅ NEW: PENDING APPROVALS SECTION */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <FaSpinner className="text-yellow-500 animate-spin" />
                  Pending Approvals
                </h2>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-2xl text-sm font-bold">
                  {pendingRegistrations.length}
                </span>
              </div>

              {pendingLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center p-6 border-b border-slate-100 bg-slate-50 rounded-2xl animate-pulse">
                      <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 rounded w-48"></div>
                        <div className="h-4 bg-slate-200 rounded w-64"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingRegistrations.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <FaCheckCircle className="text-6xl mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">No pending approvals</h3>
                  <p className="text-sm">All registrations processed</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pendingRegistrations.map((reg) => (
                    <div key={reg._id} className="flex items-center justify-between p-6 border border-slate-200 rounded-2xl hover:shadow-md hover:bg-slate-50 transition-all bg-gradient-to-r from-slate-50 to-indigo-50">
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                          <FaSpinner className="text-white text-lg animate-spin" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">{reg.studentName}</h4>
                          <p className="text-sm text-slate-600">{reg.eventTitle}</p>
                          <p className="text-xs text-slate-500 mt-1">{reg.email}</p>
                          <p className="text-xs text-slate-500 mt-1">{reg.phone || 'No phone'}</p>
                        </div>
                      </div>
                      
                      {/* ✅ APPROVE/REJECT BUTTONS */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(reg._id)}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(reg._id)}
                          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Existing Recent Events Table */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50">
                <h2 className="text-2xl font-black text-slate-900">Recent Events</h2>
                <Link to="/admin/dashboard/events" className="text-indigo-600 text-lg font-semibold hover:underline flex items-center gap-1">
                  View All → 
                </Link>
              </div>

              {loading ? (
                <div className="p-8 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <FaCalendarAlt className="text-6xl mx-auto mb-6 opacity-50" />
                  <p className="text-2xl font-bold mb-4">No events created yet</p>
                  <Link to="/admin/dashboard/create-event" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all">
                    Create First Event
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-8 py-4 font-bold text-slate-700 text-lg">Event</th>
                        <th className="text-left px-6 py-4 font-bold text-slate-700">Category</th>
                        <th className="text-left px-6 py-4 font-bold text-slate-700">Date</th>
                        <th className="text-left px-6 py-4 font-bold text-slate-700">Participants</th>
                        <th className="text-left px-6 py-4 font-bold text-slate-700">Status</th>
                        <th className="text-left px-6 py-4 font-bold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {events.slice(0, 6).map((event) => (
                        <tr key={event._id} className="hover:bg-slate-50 transition-all">
                          <td className="px-8 py-6 font-semibold text-slate-900 text-lg max-w-md truncate">
                            {event.title}
                          </td>
                          <td className="px-6 py-6">
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700">
                              {event.category}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-slate-600 font-medium">
                            {new Date(event.start_date).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-6 py-6 font-bold text-indigo-600">
                            {event.current_participants || 0} / {event.max_participants || 100}
                          </td>
                          <td className="px-6 py-6">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              event.status === "published" ? "bg-emerald-100 text-emerald-800" :
                              event.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                              <Link to={`/admin/dashboard/events/${event._id}`} className="p-2 hover:bg-indigo-100 rounded-xl text-indigo-600 hover:text-indigo-800 transition-all">
                                <FaEdit />
                              </Link>
                              <Link to={`/admin/dashboard/events/${event._id}/registrations`} className="p-2 hover:bg-emerald-100 rounded-xl text-emerald-600 hover:text-emerald-800 transition-all">
                                <FaUsers />
                              </Link>
                              <button onClick={() => handleDelete(event._id)} className="p-2 hover:bg-red-100 rounded-xl text-red-500 hover:text-red-700 transition-all">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
