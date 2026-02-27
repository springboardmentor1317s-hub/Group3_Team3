import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

function CollegeEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminEvents();
  }, []);

  const fetchAdminEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/events"); // Admin-specific endpoint
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Failed to fetch admin events:", err);
      setError("Failed to load events. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || event.status === filter)
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Category emoji map
  const categoryEmoji = {
    technical: "💻",
    cultural: "🎭",
    sports: "⚽",
    workshop: "📚",
    hackathon: "💡",
    seminar: "🎤",
    other: "🌟",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Events</h1>
            <p className="text-gray-600">Manage your college events</p>
          </div>
          <Link
            to="/admin/dashboard/create-event"
            className="px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            + New Event
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
            </div>
            <div className="flex gap-2">
              {["all", "published", "draft"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    filter === f
                      ? f === "all"
                        ? "bg-purple-100 text-purple-800"
                        : f === "published"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-orange-100 text-orange-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {f === "all"
                    ? "All"
                    : f === "published"
                    ? "✅ Published"
                    : "📝 Draft"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">
              Loading your events...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-600 mb-4">{error}</h3>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium"
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 overflow-hidden h-full flex flex-col group">
                {/* Event Image */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full flex items-center justify-center text-6xl"
                    style={{ display: event.image_url ? "none" : "flex" }}
                  >
                    {categoryEmoji[event.category] || "🎉"}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm ${
                        event.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {event.status === "published"
                        ? "✅ Published"
                        : "📝 Draft"}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {event.is_featured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700 shadow-lg">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                    {event.description}
                  </p>

                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>📅 {formatDate(event.start_date || event.date)}</span>
                    <span>📍 {event.location || event.venue}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-6">
                    <span>
                      👥 {event.current_participants || event.registeredCount || 0}/
                      {event.max_participants || event.spots || 100}
                    </span>
                    <span>
                      {categoryEmoji[event.category] || "🌟"} {event.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      to={`/admin/events/${event._id}`}
                      className="w-full block bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium text-sm hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-300 text-center"
                    >
                      View Details →
                    </Link>
                    <div className="flex gap-2 pt-2">
                      <Link
                        to={`/admin/edit-event/${event._id}`}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-xl font-semibold text-xs hover:bg-blue-600 transition-all text-center"
                      >
                        Edit
                      </Link>
                      {event.status !== "published" && (
                        <Link
                          to={`/admin/publish-event/${event._id}`}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-semibold text-xs hover:bg-emerald-600 transition-all"
                        >
                          Publish
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter !== "all"
                ? `No ${filter} events found.`
                : "Create your first event to get started!"}
            </p>
            <Link
              to="/admin/dashboard/create-event"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-all shadow-lg"
            >
              + Create Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeEvents;
