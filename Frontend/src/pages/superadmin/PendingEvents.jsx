// src/pages/superadmin/PendingEvents.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaCalendarDays,
  FaMapLocationDot,
} from "react-icons/fa6";
import { toast } from "react-toastify";

function PendingEvents() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get("/events");
      const allEvents = res.data.events || [];
      // draft events are "pending" — not yet published/approved
      setPendingEvents(allEvents.filter((e) => e.status === "draft"));
    } catch (err) {
      console.error("Failed to load pending events", err);
      toast.error("Failed to load pending events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const approveEvent = async (id) => {
    try {
      await api.put(`/events/${id}`, { status: "published" });
      toast.success("✅ Event approved and published!");
      fetchPendingEvents();
    } catch (err) {
      toast.error("Failed to approve event");
      console.error(err);
    }
  };

  const rejectEvent = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event rejected and removed.");
      fetchPendingEvents();
    } catch (err) {
      toast.error("Failed to reject event");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-1">
              Pending Events
            </h1>
            <p className="text-slate-500">
              Events awaiting super admin approval
            </p>
          </div>
          <Link
            to="/super-admin/dashboard"
            className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-3xl shadow animate-pulse"
              />
            ))}
          </div>
        ) : pendingEvents.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <FaCircleCheck className="text-7xl mx-auto mb-4 opacity-20" />
            <h3 className="text-2xl font-bold mb-2">No pending events</h3>
            <p>All events have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-black text-slate-900">
                        {event.title}
                      </h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                        Draft
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                      <span className="flex items-center gap-1">
                        <FaCalendarDays className="text-indigo-500" />
                        {new Date(event.start_date).toLocaleDateString("en-IN")}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaMapLocationDot className="text-pink-500" />
                        {event.location}
                      </span>
                      <span className="capitalize font-semibold text-indigo-600">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => approveEvent(event._id)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <FaCircleCheck /> Approve
                    </button>
                    <button
                      onClick={() => rejectEvent(event._id)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <FaCircleXmark /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingEvents;
