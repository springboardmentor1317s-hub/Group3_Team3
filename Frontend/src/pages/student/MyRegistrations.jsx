// src/pages/student/MyRegistrations.jsx - FULL CODE
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import {
  FaCalendarAlt, FaCheckCircle, FaSpinner, FaTimes, FaUser, FaArrowLeft,
  FaClock, FaBell, FaList, FaSearch
} from "react-icons/fa";

function MyRegistrations() {
  const navigate = useNavigate();
  const user = getUser();
  
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch student registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students/${user.id}/registrations`);
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      alert("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    fetchRegistrations();
  }, [user, navigate]);

  // Filter registrations
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.studentName.toLowerCase().includes(search.toLowerCase()) ||
                         reg.eventTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || reg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-2">
            ⏳ Pending Approval
          </span>
        );
      case 'approved':
        return (
          <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-2">
            ✅ Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-2">
            ❌ Rejected
          </span>
        );
      default:
        return (
          <span className="px-4 py-2 bg-slate-100 text-slate-800 rounded-full text-xs font-bold">
            Unknown
          </span>
        );
    }
  };

  // Refresh function
  const handleRefresh = () => {
    fetchRegistrations();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Please login</h1>
          <Link to="/login" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Link to="/student/dashboard" className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <FaArrowLeft className="text-xl text-slate-700" />
              </Link>
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">
                  My Registrations
                </h1>
                <p className="text-xl text-slate-600">
                  Track all your event registrations ({filteredRegistrations.length})
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <FaList /> Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-100 mb-8">
            <div className="grid md:grid-cols-3 gap-6 items-end">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by name or event..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-lg shadow-lg transition-all"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-lg shadow-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending ⏳</option>
                <option value="approved">Approved ✅</option>
                <option value="rejected">Rejected ❌</option>
              </select>
              <div className="text-right">
                <span className="text-sm text-slate-500">
                  Showing {filteredRegistrations.length} of {registrations.length} registrations
                </span>
              </div>
            </div>
          </div>

          {/* Registrations List */}
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-4">
                      <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl animate-pulse shadow-lg"></div>
                      <div className="h-6 bg-slate-200 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 shadow-2xl border border-slate-100 text-center">
                <FaList className="text-7xl text-slate-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No registrations yet</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Your registrations will appear here once you register for events.
                </p>
                <Link
                  to="/student/dashboard"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              filteredRegistrations.map((reg) => (
                <div key={reg._id} className="bg-white rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden group">
                  {/* Header */}
                  <div className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <FaCalendarAlt className="text-white text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 mb-1 line-clamp-1">
                            {reg.eventTitle}
                          </h3>
                          <p className="text-slate-600">{reg.studentName}</p>
                        </div>
                      </div>
                      
                      {/* ✅ STATUS BADGES - ADDED HERE */}
                      <StatusBadge status={reg.status} />
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-indigo-500" />
                        {new Date(reg.createdAt).toLocaleDateString("en-IN")}
                      </div>
                      {reg.eventDate && (
                        <div className="flex items-center gap-2">
                          <FaClock />
                          {new Date(reg.eventDate).toLocaleDateString("en-IN")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 mb-3">Contact Info</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                              📧
                            </span>
                            <span>{reg.email}</span>
                          </div>
                          {reg.phone && (
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                📱
                              </span>
                              <span>{reg.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                              🏫
                            </span>
                            <span>{reg.college}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 mb-3">Event Details</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                          {reg.eventLocation && (
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                📍
                              </span>
                              <span>{reg.eventLocation}</span>
                            </div>
                          )}
                          {reg.eventDescription && (
                            <p className="text-slate-700 leading-relaxed">{reg.eventDescription}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {reg.status === 'approved' && (
                      <div className="pt-6 border-t border-slate-200">
                        <Link
                          to={`/student/events/${reg.eventId}`}
                          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all group"
                        >
                          View Event Details
                          <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyRegistrations;
