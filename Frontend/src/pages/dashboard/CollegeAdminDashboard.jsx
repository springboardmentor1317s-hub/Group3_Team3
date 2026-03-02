import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaChartBar,
  FaPlus,
  FaArrowRight,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

function CollegeAdminDashboard() {
  const user = getUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
<<<<<<< HEAD
      const res = await api.get("/events", {
        params: { college_id: user?.id },
      });
=======
      const res = await api.get("/events");
>>>>>>> ea643e9 (feat: student dashboard filter - added completed status + all events filter)
      setEvents(res.data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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
      label: "Total Registrations",
      value: totalParticipants,
      icon: <FaUsers />,
      color: "from-orange-400 to-pink-500",
    },
    {
      label: "Avg Participants",
      value: events.length ? Math.round(totalParticipants / events.length) : 0,
      icon: <FaChartBar />,
      color: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-800">
                Event Organizer Dashboard
              </h1>
              <p className="text-slate-500 mt-1">
                Manage your events and track performance
              </p>
            </div>
            <Link
              to="/admin/dashboard/create-event"
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <FaPlus /> Create Event
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg mb-3`}
                >
                  {s.icon}
                </div>
                <p className="text-2xl font-black text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link
              to="/admin/dashboard/create-event"
              className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              <span className="flex items-center gap-2">
                <FaPlus /> Create New Event
              </span>
              <FaArrowRight />
            </Link>
            <Link
              to="/admin/dashboard/events"
              className="flex items-center justify-between p-4 bg-white border-2 border-indigo-200 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition"
            >
              <span className="flex items-center gap-2">
                <FaEye /> View All Registrations
              </span>
              <FaArrowRight />
            </Link>
            <button className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition">
              <span className="flex items-center gap-2">
                <FaChartBar /> Export Event Data
              </span>
              <FaArrowRight />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">
                Recent Events
              </h2>
              <Link
                to="/admin/dashboard/events"
                className="text-indigo-600 text-sm font-semibold hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-slate-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <FaCalendarAlt className="text-5xl mx-auto mb-4" />
                <p className="font-semibold">No events yet</p>
                <Link
                  to="/admin/dashboard/create-event"
                  className="mt-3 inline-block text-indigo-600 font-bold hover:underline"
                >
                  Create your first event →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-slate-600">
                        Event
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-600">
                        Category
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-600">
                        Date
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-600">
                        Participants
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-600">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 font-semibold text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.slice(0, 8).map((event) => (
                      <tr
                        key={event._id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {event.title}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 capitalize">
                            {event.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(event.start_date).toLocaleDateString(
                            "en-IN",
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {event.current_participants || 0} /{" "}
                          {event.max_participants}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize
                            ${
                              event.status === "published"
                                ? "bg-green-100 text-green-700"
                                : event.status === "draft"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : event.status === "completed"
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-red-100 text-red-600"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/admin/dashboard/events/${event._id}`}
                              className="text-indigo-500 hover:text-indigo-700"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <Link
                              to={`/admin/dashboard/events/${event._id}/registrations`}
                              className="text-emerald-500 hover:text-emerald-700"
                              title="Registrations"
                            >
                              <FaUsers />
                            </Link>
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="text-red-400 hover:text-red-600"
                              title="Delete"
                            >
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
    </>
  );
}

export default CollegeAdminDashboard;
