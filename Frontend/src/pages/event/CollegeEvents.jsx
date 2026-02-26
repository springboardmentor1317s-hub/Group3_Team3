import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function CollegeEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Mock events data (replace with API call)
  const mockEvents = [
    {
      id: 1,
      title: "Cultural Fest 2026",
      status: "published",
      progress: "67%",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587208?w=400",
      registrations: "142/200",
      date: "Feb 20-22"
    },
    {
      id: 2,
      title: "Tech Workshop",
      status: "draft", 
      progress: "23%",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
      registrations: "23/50",
      date: "Mar 5"
    }
  ];

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || event.status === filter)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header - EXACT */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Events</h1>
            <p className="text-gray-600">Manage your college events</p>
          </div>
          <Link to="/college-admin/create-event" className="px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700">
            + New
          </Link>
        </div>

        {/* Search & Filter - EXACT */}
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
              <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === "all" ? "bg-purple-100 text-purple-800" : "text-gray-600 hover:text-gray-900"}`}>
                All
              </button>
              <button onClick={() => setFilter("published")} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === "published" ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:text-gray-900"}`}>
                Published
              </button>
              <button onClick={() => setFilter("draft")} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === "draft" ? "bg-orange-100 text-orange-800" : "text-gray-600 hover:text-gray-900"}`}>
                Draft
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid - EXACT Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link key={event.id} to={`/college-admin/event/${event.id}`} className="group">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 overflow-hidden">
                {/* Event Image */}
                <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-500 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold rounded-full shadow-lg ${
                      event.status === "published" 
                        ? "text-emerald-700 bg-emerald-100" 
                        : "text-orange-700 bg-orange-100"
                    }`}>
                      {event.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {event.title}
                  </h3>
                  
                  {/* Progress Bar - EXACT */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{event.progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-700 ${
                          event.status === "published" ? "from-emerald-500 to-teal-500" : ""
                        }`}
                        style={{ width: event.progress }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>📅 Feb 20-22</span>
                    <span>👥 142/200</span>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium text-sm hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg transition-all duration-300">
                    View Details →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-gray-400">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">Create your first event to get started</p>
            <Link to="/college-admin/create-event" className="inline-block px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
              Create Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeEvents;
