// src/pages/dashboard/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt, FaCheckCircle, FaClock, FaTrophy, FaSearch, 
  FaArrowRight, FaFilter, FaChartBar, FaBell, FaList, FaUser
} from "react-icons/fa";

function StudentDashboard() {
  const user = getUser();
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/events");
        const events = res.data.events || [];
        setAllEvents(events);

        // Default upcoming events (today ku aprm)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = events
          .filter((e) => {
            if (!e.start_date) return false;
            const eventDate = new Date(e.start_date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today;
          })
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
          .slice(0, 6);

        setFilteredEvents(upcoming);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter events based on search, category, status
  useEffect(() => {
    let results = [...allEvents];

    // Search filter
    if (search) {
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      results = results.filter((event) => event.category === filterCategory);
    }

    // Status filter (All + Upcoming + Ongoing + Completed)
    if (filterStatus !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      results = results.filter((event) => {
        if (!event.start_date || !event.end_date) return false;

        const eventStart = new Date(event.start_date);
        const eventEnd = new Date(event.end_date);
        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(0, 0, 0, 0);

        switch (filterStatus) {
          case "upcoming":
            return eventStart >= today;
          case "ongoing":
            return eventStart <= today && eventEnd >= today;
          case "completed":
            return eventEnd < today;
          default:
            return true;
        }
      });
    }

    setFilteredEvents(results.slice(0, 6));
  }, [search, filterCategory, filterStatus, allEvents]);

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("all");
    setFilterStatus("all");
  };

  const stats = [
    {
      label: "Total Events",
      value: allEvents.length,
      icon: <FaCalendarAlt />,
      color: "from-indigo-500 to-purple-600",
    },
    {
      label: "Upcoming Events",
      value: filteredEvents.length,
      icon: <FaClock />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Hackathons",
      value: allEvents.filter((e) => e.category === "hackathon").length,
      icon: <FaTrophy />,
      color: "from-orange-400 to-pink-500",
    },
    {
      label: "Cultural",
      value: allEvents.filter((e) => e.category === "cultural").length,
      icon: <FaCheckCircle />,
      color: "from-yellow-400 to-orange-500",
    },
  ];

  const categories = [
    { value: "all", label: "All Types" },
    { value: "hackathon", label: "Hackathon 💻" },
    { value: "cultural", label: "Cultural 🎭" },
    { value: "sports", label: "Sports ⚽" },
    { value: "workshop", label: "Workshop 📚" },
    { value: "seminar", label: "Seminar 🎤" },
  ];

  return (
    <>
      <Navbar />
      
      {/* ✅ FLEX LAYOUT + SIDEBAR */}
      <div className="flex min-h-screen">
        {/* 🎯 SIDEBAR */}
        <div className="w-64 bg-white shadow-2xl border-r border-gray-200 p-6 sticky top-0 h-screen">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Student Portal</h2>
          </div>
          
          <nav className="space-y-2">

            {/* ✅ Profile - FIRST */}
           
            <Link to="/student/profile" className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50 text-indigo-600 font-semibold shadow-sm">
              <FaUser className="text-xl" />
              My Profile
            </Link>


            <Link 
              to="/student/dashboard" 
              className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50 text-blue-600 font-semibold shadow-sm"
            >
              <FaChartBar className="text-xl" />
              Dashboard
            </Link>
            
            <Link 
              to="/student/notifications" 
              className="flex items-center gap-3 p-3 rounded-2xl text-gray-700 hover:bg-emerald-50 font-medium relative group"
            >
              <FaBell className="text-xl" />
              Notifications 
              <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full ml-2 group-hover:scale-110 transition-all">4</span>
            </Link>
            
            <Link 
              to="/student/events" 
              className="flex items-center gap-3 p-3 rounded-2xl text-gray-700 hover:bg-purple-50 font-medium"
            >
              <FaCalendarAlt className="text-xl" />
              Browse Events
            </Link>
            
            <Link 
              to="/student/registrations" 
              className="flex items-center gap-3 p-3 rounded-2xl text-gray-700 hover:bg-orange-50 font-medium"
            >
              <FaList className="text-xl" />
              My Registrations
            </Link>



          </nav>
        </div>

        {/* ✅ MAIN CONTENT */}
        <div className="flex-1">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800">
                  Welcome back, {user?.fullName || user?.name || "Student"}! 👋
                </h1>
                <p className="text-slate-500 mt-1">{user?.college} · Student</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all"
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

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Link
                  to="/student/events"
                  className="group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <FaSearch className="text-xl" />
                    Browse Events
                  </h3>
                  <p className="text-indigo-100 text-sm mb-4">
                    Discover hackathons, cultural fests, sports & more
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold">
                    Explore Now{" "}
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/student/registrations"
                  className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  <h3 className="text-lg font-bold mb-2">My Registrations</h3>
                  <p className="text-emerald-100 text-sm mb-4">
                    View and manage all your event registrations
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold">
                    View All <FaArrowRight />
                  </span>
                </Link>
              </div>

              {/* Events Filter Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-100 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    <FaFilter className="text-indigo-600" />
                    Upcoming Events
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all flex items-center gap-1"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Search */}
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-lg shadow-sm"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-lg shadow-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-lg shadow-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming ⏳</option>
                    <option value="ongoing">Ongoing ▶️</option>
                    <option value="completed">Completed ✅</option>
                  </select>
                </div>

                {/* Events Grid */}
                {loading ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="h-40 bg-slate-100 rounded-2xl animate-pulse shadow-sm"
                      />
                    ))}
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <FaSearch className="text-6xl mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2 text-slate-600">
                      No events found
                    </h3>
                    <p className="text-sm">
                      Try adjusting your filters or check back later
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <Link
                        key={event._id}
                        to={`/student/events/${event._id}`}
                        className="group bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                      >
                        {/* Category Badge */}
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                            event.category === "hackathon"
                              ? "bg-blue-100 text-blue-800"
                              : event.category === "cultural"
                              ? "bg-pink-100 text-pink-800"
                              : event.category === "sports"
                              ? "bg-emerald-100 text-emerald-800"
                              : event.category === "workshop"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {event.category?.charAt(0).toUpperCase() +
                            event.category?.slice(1)}
                        </span>

                        {/* Event Title */}
                        <h4 className="font-black text-lg text-slate-900 mb-3 leading-tight group-hover:text-indigo-700 transition-colors">
                          {event.title}
                        </h4>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-indigo-500" />
                            {new Date(event.start_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            {event.location || event.venue || "Campus"}
                          </div>
                          {event.registeredCount && (
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                              <span>👥</span>
                              {event.registeredCount}/{event.max_participants || 100} registered
                            </div>
                          )}
                        </div>

                        {/* View Details Button */}
                        <div className="pt-4 border-t border-slate-100">
                          <span className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-700 group-hover:translate-x-1 transition-all">
                            View Details <FaArrowRight />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Results Count */}
                {!loading && (
                  <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                    <p className="text-sm text-slate-500">
                      Showing{" "}
                      <span className="font-bold text-indigo-600">
                        {filteredEvents.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-slate-800">
                        {allEvents.length}
                      </span>{" "}
                      events
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
