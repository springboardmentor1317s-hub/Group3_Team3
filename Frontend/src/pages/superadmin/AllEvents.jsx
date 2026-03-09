// src/pages/superadmin/AllEvents.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { 
  FaSearch, FaCalendarAlt, FaUsers, FaEye, FaEdit, FaTrash, 
  FaCheckCircle, FaClock, FaExclamationTriangle 
} from "react-icons/fa";

function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for demo
  const mockEvents = [
    {
      _id: "1",
      title: "TCY Tech Fest 2025",
      collegeName: "TCY Engineering College",
      category: "Tech",
      status: "approved",
      registeredCount: 245,
      date: "2026-03-15"
    },
    {
      _id: "2", 
      title: "VTU Cultural Night",
      collegeName: "VTU College of Engineering",
      category: "Cultural",
      status: "pending",
      registeredCount: 89,
      date: "2026-03-20"
    },
    {
      _id: "3",
      title: "PERUMAL Sports Meet",
      collegeName: "Perumal Engineering College",
      category: "Sports", 
      status: "approved",
      registeredCount: 156,
      date: "2026-03-25"
    },
    {
      _id: "4",
      title: "MGR Hackathon 2025",
      collegeName: "MGR University",
      category: "Tech",
      status: "approved", 
      registeredCount: 312,
      date: "2026-04-01"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 800);
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filterStatus === 'all' || event.status === filterStatus
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900">All Events</h1>
                <p className="text-slate-600">Manage all events across colleges</p>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events, colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white/50"
                />
              </div>
              
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white/50"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-2xl" />
                <h2 className="text-2xl font-black">Event Management ({filteredEvents.length})</h2>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-2xl mx-auto"></div>
                    <div className="h-8 bg-slate-200 rounded-xl w-3/4 mx-auto"></div>
                    <div className="h-6 bg-slate-200 rounded-lg w-1/2 mx-auto"></div>
                    <div className="h-12 bg-slate-200 rounded-2xl w-full"></div>
                  </div>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <FaCalendarAlt className="text-8xl mx-auto mb-6 opacity-30" />
                <h3 className="text-2xl font-bold mb-2">No Events Found</h3>
                <p className="text-lg">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredEvents.map((event) => (
                  <div key={event._id} className="p-8 hover:bg-slate-50/50 group">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {/* Event Card */}
                      <Link to={`/super-admin/events/${event._id}`} className="lg:col-span-2 group-hover:shadow-lg transition-all">
                        <div className="flex items-start gap-6">
                          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 text-white font-bold text-xl ${{
                            'Tech': 'bg-gradient-to-br from-indigo-500 to-purple-600',
                            'Cultural': 'bg-gradient-to-br from-emerald-500 to-teal-600', 
                            'Sports': 'bg-gradient-to-br from-orange-500 to-red-500'
                          }[event.category] || 'bg-gradient-to-br from-slate-500 to-gray-600'}`}>
                            {event.category?.charAt(0) || 'E'}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 mb-2 truncate">
                              {event.title}
                            </h3>
                            <p className="text-lg text-slate-600 mb-4">{event.collegeName}</p>
                            
                            <div className="flex items-center gap-4 mb-4">
                              <span className={`px-4 py-2 rounded-full font-semibold text-sm ${{
                                approved: 'bg-emerald-100 text-emerald-800',
                                pending: 'bg-amber-100 text-amber-800'
                              }[event.status] || 'bg-slate-100 text-slate-800'}`}>
                                {event.status.toUpperCase()}
                              </span>
                              <div className="flex items-center gap-2 text-slate-600">
                                <FaUsers className="text-lg" />
                                <span className="font-semibold">{event.registeredCount}</span> registered
                              </div>
                              <div className="flex items-center gap-1 text-slate-600 text-sm">
                                <FaCalendarAlt />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Actions */}
                      <div className="flex gap-2 lg:justify-end pt-2 lg:pt-0">
                        <Link 
                          to={`/super-admin/events/${event._id}`} 
                          className="p-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-2xl hover:shadow-md transition-all flex-1 text-center"
                          title="View Details"
                        >
                          <FaEye className="text-xl mx-auto" />
                        </Link>
                        <button className="p-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-2xl hover:shadow-md transition-all flex-1 text-center">
                          <FaCheckCircle className="text-xl mx-auto" />
                        </button>
                        <button className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl hover:shadow-md transition-all flex-1 text-center">
                          <FaEdit className="text-xl mx-auto" />
                        </button>
                        <button className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl hover:shadow-md transition-all flex-1 text-center">
                          <FaTrash className="text-xl mx-auto" />
                        </button>
                      </div>
                    </div>
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

export default AllEvents;
