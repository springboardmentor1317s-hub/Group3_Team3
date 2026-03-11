// src/pages/dashboard/StudentDashboard.jsx - APPROVAL FLOW + SIMPLIFIED
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt, FaCheckCircle, FaClock, FaTrophy, FaSearch, 
  FaFilter, FaChartBar, FaBell, FaList, FaUser, FaPlus, FaSpinner
} from "react-icons/fa";

function StudentDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  
  // Main states
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // Registration modal states
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: ''
  });

  // Fetch events
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/events");
        const events = res.data.events || [];
        setAllEvents(events);

        // Show upcoming events
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
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter events
  useEffect(() => {
    let results = [...allEvents];

    if (search) {
      results = results.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      results = results.filter(event => event.category === filterCategory);
    }

    if (filterStatus !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      results = results.filter(event => {
        if (!event.start_date || !event.end_date) return false;
        const eventStart = new Date(event.start_date);
        const eventEnd = new Date(event.end_date);
        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(0, 0, 0, 0);
        
        switch (filterStatus) {
          case "upcoming": return eventStart >= today;
          case "ongoing": return eventStart <= today && eventEnd >= today;
          case "completed": return eventEnd < today;
          default: return true;
        }
      });
    }

    setFilteredEvents(results.slice(0, 6));
  }, [search, filterCategory, filterStatus, allEvents]);

  // Registration modal handlers
  const openRegistrationForm = (event) => {
    setSelectedEvent(event);
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: '',
      college: user?.college || ''
    });
    setShowRegistrationForm(true);
  };

  const closeRegistrationForm = () => {
    setShowRegistrationForm(false);
    setSelectedEvent(null);
    setFormData({ fullName: '', email: '', phone: '', college: '' });
  };

  // Submit registration (PENDING APPROVAL FLOW)
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    
    if (!getUser()?.id) {
      alert("Please login to register!");
      navigate('/login');
      return;
    }

    try {
      await api.post(`/events/${selectedEvent._id}/register`, {
        ...formData,
        studentId: getUser().id,
        status: "pending"  // Sends to admin for approval
      });

      closeRegistrationForm();
      alert("✅ Registration submitted successfully!\n⏳ Waiting for Admin approval...\n📧 Check notifications for updates!");
      
      // Refresh page to show updated data
      window.location.reload();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        alert("❌ Already requested! Check My Registrations.");
      } else if (err.response?.status === 403) {
        alert("❌ Event capacity full!");
      } else {
        alert("❌ Registration failed. Please try again!");
      }
    }
  };

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("all");
    setFilterStatus("all");
  };

  // Stats data
  const stats = [
    {
      label: "Total Events",
      value: allEvents.length,
      icon: <FaCalendarAlt />,
      color: "from-indigo-500 to-purple-600"
    },
    {
      label: "Upcoming Events",
      value: filteredEvents.length,
      icon: <FaClock />,
      color: "from-emerald-500 to-teal-600"
    },
    {
      label: "Hackathons",
      value: allEvents.filter(e => e.category === "hackathon").length,
      icon: <FaTrophy />,
      color: "from-orange-400 to-pink-500"
    },
    {
      label: "Cultural",
      value: allEvents.filter(e => e.category === "cultural").length,
      icon: <FaCheckCircle />,
      color: "from-yellow-400 to-orange-500"
    }
  ];

  const categories = [
    { value: "all", label: "All Types" },
    { value: "hackathon", label: "Hackathon 💻" },
    { value: "cultural", label: "Cultural 🎭" },
    { value: "sports", label: "Sports ⚽" },
    { value: "workshop", label: "Workshop 📚" },
    { value: "seminar", label: "Seminar 🎤" }
  ];

  return (
    <>
      <Navbar />
      
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-2xl border-r border-gray-200 p-6 sticky top-0 h-screen overflow-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Student Portal</h2>
          </div>
          
          <nav className="space-y-2">
            <Link 
              to="/student/profile" 
              className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50 text-indigo-600 font-semibold shadow-sm hover:shadow-md transition-all"
            >
              <FaUser className="text-xl" />
              My Profile
            </Link>
            <Link 
              to="/student/dashboard" 
              className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50 text-blue-600 font-semibold shadow-sm hover:shadow-md transition-all"
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
              <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full ml-2 group-hover:scale-110 transition-all absolute -top-1 -right-1">4</span>
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

        {/* Main Content */}
        <div className="flex-1">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                  Welcome back, {user?.fullName || user?.name || "Student"}! 👋
                </h1>
                <p className="text-slate-500 text-lg">{user?.college || "Your College"} · Student</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Events Section */}
              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-slate-100 mb-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
                  <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <FaFilter className="text-indigo-600 text-2xl" />
                    Upcoming Events
                  </h2>
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Search events by name or description..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-lg shadow-lg transition-all"
                    />
                  </div>
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-4 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-lg shadow-lg"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-4 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-lg shadow-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming ⏳</option>
                    <option value="ongoing">Ongoing ▶️</option>
                    <option value="completed">Completed ✅</option>
                  </select>
                </div>

                {/* Events Grid */}
                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl animate-pulse shadow-xl" />
                    ))}
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-24 text-slate-400">
                    <FaSearch className="text-8xl mx-auto mb-8 opacity-30" />
                    <h3 className="text-2xl font-bold mb-4 text-slate-600">No events found</h3>
                    <p className="text-lg">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => (
                      <div 
                        key={event._id} 
                        className="group bg-white/70 backdrop-blur-xl border border-slate-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden"
                      >
                        {/* Category Badge */}
                        <span className={`inline-block px-4 py-2 rounded-2xl text-xs font-bold mb-6 shadow-lg transform group-hover:scale-105 transition-all ${
                          event.category === "hackathon" ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white" :
                          event.category === "cultural" ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white" :
                          event.category === "sports" ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white" :
                          event.category === "workshop" ? "bg-gradient-to-r from-purple-400 to-indigo-500 text-white" :
                          "bg-gradient-to-r from-indigo-400 to-purple-500 text-white"
                        }`}>
                          {event.category?.charAt(0).toUpperCase() + event.category?.slice(1)}
                        </span>

                        {/* Event Title */}
                        <h3 className="font-black text-2xl text-slate-900 mb-6 leading-tight group-hover:text-indigo-700 transition-all line-clamp-2">
                          {event.title}
                        </h3>

                        {/* Event Details */}
                        <div className="space-y-4 mb-8 text-slate-600">
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                            <FaCalendarAlt className="text-indigo-500 text-xl" />
                            <span className="font-semibold">
                              {new Date(event.start_date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                            <span className="text-2xl">📍</span>
                            <span>{event.location || event.venue || "Campus"}</span>
                          </div>
                          {event.registeredCount !== undefined && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                              <span className="text-2xl">👥</span>
                              <span className="font-semibold text-indigo-600">
                                {event.registeredCount}/{event.max_participants || 100} registered
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                          <Link
                            to={`/student/events/${event._id}`}
                            className="flex-1 text-center py-4 px-6 text-lg font-bold text-indigo-600 border-2 border-indigo-200 rounded-2xl hover:bg-indigo-50 hover:shadow-xl hover:border-indigo-400 transition-all shadow-md"
                          >
                            View Details →
                          </Link>
                          <button
                            onClick={() => openRegistrationForm(event)}
                            disabled={event.registeredCount >= (event.max_participants || 100)}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center gap-3"
                          >
                            {event.registeredCount >= (event.max_participants || 100) ? (
                              "Event Full"
                            ) : (
                              <>
                                <FaPlus className="text-sm" />
                                Register Now
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Results Count */}
                {!loading && (
                  <div className="mt-12 pt-8 border-t-2 border-slate-200 text-center">
                    <p className="text-xl text-slate-500">
                      Showing <span className="font-bold text-indigo-600 text-2xl">{filteredEvents.length}</span> of 
                      <span className="font-bold text-slate-800 text-2xl mx-2">{allEvents.length}</span> events found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationForm && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">
                    Register for <span className="text-indigo-600">{selectedEvent.title}</span>
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <FaCalendarAlt className="text-indigo-500" />
                    <span>{new Date(selectedEvent.start_date).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
                <button
                  onClick={closeRegistrationForm}
                  className="p-3 hover:bg-slate-100 rounded-2xl text-slate-500 hover:text-slate-900 hover:shadow-md transition-all text-2xl"
                >
                  ✕
                </button>
              </div>
              
              
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegistrationSubmit} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 text-lg shadow-lg transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 text-lg shadow-lg transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 text-lg shadow-lg transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">College *</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({...formData, college: e.target.value})}
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 text-lg shadow-lg transition-all"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={closeRegistrationForm}
                  className="flex-1 py-5 px-8 border-2 border-slate-200 text-slate-700 font-bold text-lg rounded-2xl hover:bg-slate-50 hover:shadow-xl hover:border-slate-300 transition-all shadow-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-5 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all"
                >
                  Register for event → 
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentDashboard;
