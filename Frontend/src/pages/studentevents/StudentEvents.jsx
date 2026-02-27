// Frontend/src/pages/studentevents/StudentEvents.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import StudentEventCard from './StudentEventCard';

const StudentEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setEvents([
        { id: 1, title: "Hackathon 2026", date: "2026-03-05", status: "upcoming", category: "hackathon" },
        { id: 2, title: "Cultural Night", date: "2026-02-28", status: "upcoming", category: "cultural" },
        { id: 3, title: "Tech Workshop", date: "2026-02-20", status: "completed", category: "workshop" }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const TopNav = () => (
    <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-purple-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/student/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎓</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              CampusHub
            </span>
          </Link>

          {/* Center: Navigation Tabs */}
          <div className="flex gap-1 bg-purple-50/50 px-4 py-2 rounded-2xl border border-purple-200">
            {[
              { id: 'dashboard', label: 'Dashboard', path: '/student/dashboard' },
              { id: 'allevents', label: 'All Events', path: '/student/events?tab=allevents' },
              { id: 'myreg', label: 'My Registration', path: '/student/registrations' }
            ].map(tab => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-white/50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Right: Profile */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all">
              Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <TopNav />
      
      {/* Content based on active tab */}
      {activeTab === 'dashboard' && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
            Welcome to Campus Events! 🎉
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Upcoming Events</span>
                    <span className="font-bold text-purple-600">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registered</span>
                    <span className="font-bold text-green-600">3</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Featured Events */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.slice(0, 2).map(event => (
                  <StudentEventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'allevents' && (
        <AllEventsTab events={events} loading={loading} />
      )}
    </div>
  );
};

// All Events Tab Component
const AllEventsTab = ({ events, loading }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (filterType === 'all' || event.category === filterType) &&
    (filterStatus === 'all' || event.status === filterStatus)
  );

  const clearFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterStatus('all');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          All Events
        </h1>
        <p className="text-xl text-gray-600">Discover exciting campus events</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all text-lg"
            />
            <span className="absolute left-5 top-5 text-2xl text-gray-400">🔍</span>
          </div>

          {/* Event Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 text-lg"
            >
              <option value="all">All Types</option>
              <option value="hackathon">Hackathon 💡</option>
              <option value="workshop">Workshop 📚</option>
              <option value="cultural">Cultural 🎭</option>
              <option value="sports">Sports ⚽</option>
              <option value="seminar">Seminar 🎤</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 p-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 text-lg"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming ⏳</option>
              <option value="completed">Completed ✅</option>
            </select>
            <button
              onClick={clearFilters}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all text-lg"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          Array(8).fill().map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-3xl p-8 h-96"></div>
          ))
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <StudentEventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No events found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search or filter options</p>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600">
          Showing {filteredEvents.length} of {events.length} events
        </p>
      </div>
    </div>
  );
};

export default StudentEvents;
