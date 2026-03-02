import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTrophy,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

function StudentDashboard() {
  const user = getUser();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get("/events");
      const all = res.data.events || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0); // reset to start of day

      const filteredEvents = all
        .filter((e) => {
          if (!e.start_date) return false;
          const eventDate = new Date(e.start_date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        })
        .sort(
          (a, b) =>
            new Date(a.start_date) - new Date(b.start_date)
        )
        .slice(0, 6);

      setUpcomingEvents(filteredEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const stats = [
    {
      label: "Registered Events",
      value: registeredEvents.length,
      icon: <FaCalendarAlt />,
      color: "from-indigo-500 to-purple-600",
    },
    {
      label: "Upcoming Events",
      value: upcomingEvents.length,
      icon: <FaClock />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Completed",
      value: 0,
      icon: <FaCheckCircle />,
      color: "from-orange-400 to-pink-500",
    },
    {
      label: "Certificates",
      value: 0,
      icon: <FaTrophy />,
      color: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800">
              Welcome back, {user?.fullName || user?.name || "Student"}! 👋
            </h1>
            <p className="text-slate-500 mt-1">{user?.college} · Student</p>
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

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Browse Events</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Discover hackathons, cultural fests, sports & more from colleges
                near you.
              </p>
              <Link
                to="/student/events"
                className="inline-flex items-center gap-2 px-5 py-2 bg-white text-indigo-600 font-bold rounded-xl text-sm hover:shadow-lg transition-all"
              >
                Explore Events <FaArrowRight />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">My Registrations</h3>
              <p className="text-emerald-100 text-sm mb-4">
                View and manage all your event registrations in one place.
              </p>
              <button className="inline-flex items-center gap-2 px-5 py-2 bg-white text-emerald-600 font-bold rounded-xl text-sm hover:shadow-lg transition-all">
                View Registrations <FaArrowRight />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-slate-800">
                Upcoming Events
              </h2>
              <Link
                to="/student/events"
                className="text-indigo-600 font-semibold text-sm hover:underline flex items-center gap-1"
              >
                See all <FaArrowRight />
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-slate-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FaSearch className="text-4xl mx-auto mb-3" />
                <p>No upcoming events found. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2
                      ${
                        event.category === "hackathon"
                          ? "bg-blue-100 text-blue-700"
                          : event.category === "cultural"
                            ? "bg-pink-100 text-pink-700"
                            : event.category === "sports"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {event.category}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      {new Date(event.start_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {event.location}
                    </p>
                    <Link
                      to="/student/events"
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
