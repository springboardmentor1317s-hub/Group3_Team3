import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", search: "" });
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);
  useEffect(() => {
    filterEvents();
  }, [events, filters]);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data.events || []);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;
    if (filters.category) {
      filtered = filtered.filter(
        (e) => e.category?.toLowerCase() === filters.category.toLowerCase(),
      );
    }
    if (filters.search) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          e.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
          e.location?.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }
    setFilteredEvents(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getCategoryColor = (category) => {
    const colors = {
      sports: "bg-green-100 text-green-800",
      hackathon: "bg-blue-100 text-blue-800",
      cultural: "bg-purple-100 text-purple-800",
      workshop: "bg-orange-100 text-orange-800",
      seminar: "bg-red-100 text-red-800",
      technical: "bg-indigo-100 text-indigo-800",
      social: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">
              Discover and join amazing events happening around you
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search events..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="md:w-48 relative">
                <FaFilter className="absolute left-3 top-3 text-gray-400" />
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  <option value="sports">Sports</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="cultural">Cultural</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="technical">Technical</option>
                  <option value="social">Social</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FaCalendarAlt className="mx-auto h-12 w-12 mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No events found
              </h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-3 ${getCategoryColor(event.category)}`}
                    >
                      {event.category}
                    </span>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt />
                        {formatDate(event.start_date)} -{" "}
                        {formatDate(event.end_date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers />
                        {event.current_participants || 0} /{" "}
                        {event.max_participants} registered
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 truncate">
                        {event.organizer}
                      </span>

                      {events.map((event) => {
                          console.log("EVENT:", event); // 👈 check this
                          return (
                            <Link to={`/events/${event._id}`}>
                              View Details
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Events;