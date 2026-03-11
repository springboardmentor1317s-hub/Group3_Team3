import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaArrowLeft,
} from "react-icons/fa";

const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
};

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/registrations/my")
      .then((res) => setRegistrations(res.data.registrations || []))
      .catch(() => toast.error("Failed to load your registrations"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                My Registrations
              </h1>
              <p className="text-slate-500 mt-1">
                Track all your event registrations and their status
              </p>
            </div>
            <Link
              to="/student/events"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
            >
              <FaArrowLeft className="text-xs" /> Browse Events
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && registrations.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <FaTicketAlt className="text-indigo-400 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">
                No registrations yet
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                You haven't registered for any events yet.
              </p>
              <Link
                to="/student/events"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
              >
                <FaTicketAlt /> Browse Events
              </Link>
            </div>
          )}

          {/* Registration cards */}
          {!loading && registrations.length > 0 && (
            <div className="space-y-4">
              {registrations.map((reg) => {
                const event = reg.event_id;
                if (!event) return null;
                return (
                  <div
                    key={reg._id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    {/* Event image */}
                    {event.image_url && (
                      <img
                        src={`http://localhost:5000${event.image_url}`}
                        alt={event.title}
                        className="w-full sm:w-24 h-24 object-cover rounded-xl flex-shrink-0"
                      />
                    )}
                    {!event.image_url && (
                      <div className="w-full sm:w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                        <FaCalendarAlt className="text-indigo-400 text-2xl" />
                      </div>
                    )}

                    {/* Event info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold capitalize">
                          {event.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[reg.status] || STATUS_STYLES.pending}`}
                        >
                          {reg.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 truncate">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-indigo-400" />
                          {new Date(event.start_date).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-indigo-400" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Registered on{" "}
                        {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Status badge (large) */}
                    <div className="flex-shrink-0 text-right">
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${STATUS_STYLES[reg.status] || STATUS_STYLES.pending}`}
                      >
                        {reg.status === "pending"
                          ? "⏳ Pending"
                          : reg.status === "approved"
                            ? "✅ Approved"
                            : "❌ Rejected"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyRegistrations;
