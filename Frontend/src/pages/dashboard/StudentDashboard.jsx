import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import StudentEventCard from "../studentevents/StudentEventCard";

function StudentDashboard() {
  
  // Top la add pannunga (function start la):
const user = JSON.parse(localStorage.getItem('user') || '{}');



  // Stats data
  const stats = [
    { label: "Registered Events", value: "8", subtitle: "3 upcoming, 5 completed", icon: "🎫", color: "emerald" },
    { label: "Avg Rating", value: "4.7", subtitle: "Based on 23 reviews", icon: "⭐", color: "blue" },
    { label: "Upcoming", value: "3", subtitle: "Events this week", icon: "⏰", color: "orange" },
    { label: "Certificates", value: "12", subtitle: "Events completed", icon: "🏆", color: "purple" }
  ];

  const recentEvents = [
    { 
      id: 1,
      title: "Inter-College Hackathon 2026", 
      college: "SRM Institute", 
      date: "2026-02-20", 
      status: "upcoming", 
      participants: "127/200",
      category: "hackathon",
      venue: "Main Auditorium",
      description: "Code, compete, win prizes!"
    },
    { 
      id: 2,
      title: "Cultural Fest - Rhythm 2026", 
      college: "VIT Vellore", 
      date: "2026-03-05", 
      status: "upcoming", 
      participants: "89/150",
      category: "cultural",
      venue: "Cultural Hall",
      description: "Dance, music, celebration!"
    },
    { 
      id: 3,
      title: "Sports Championship", 
      college: "Anna University", 
      date: "2026-02-15", 
      status: "completed", 
      participants: "245",
      category: "sports",
      venue: "Sports Ground",
      description: "Athletic excellence!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/student/dashboard" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                CampusHub
              </span>
            </Link>

            {/* Navigation Tabs */}
            <div className="flex bg-purple-50/80 px-2 py-2 rounded-2xl border border-purple-200 shadow-inner">
              <Link 
                to="/student/dashboard" 
                className="px-8 py-4 rounded-xl font-bold text-lg bg-white shadow-md text-slate-800 mr-2"
              >
                Dashboard
              </Link>
              <Link 
                to="/student/events" 
                className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg mr-2"
              >
                Browse All Events
              </Link>
              <Link 
                to="/student/registrations" 
                className="px-8 py-4 rounded-xl font-bold text-lg text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-all shadow-md"
              >
                My Registrations
              </Link>
            </div>

            {/* Profile */}
            {/* Profile - OLD CODE REPLACE pannunga */}
           {/* Profile Dropdown - Real Name */}
<div className="relative">
  <button className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all group">
    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
      <span className="text-lg">👤</span>
    </div>
    {/* 👇 Real Name from localStorage */}
    <span className="hidden md:block">{user.name || user.fullName || 'Student'}</span>
    <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Dropdown Menu */}
  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
    {/* Profile Info - Real Data */}
    <div className="px-6 py-4 border-b border-purple-100">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
          {/* Initials from name */}
          <span className="text-white font-bold text-lg">
            {user.name ? user.name.charAt(0).toUpperCase() + (user.name.split(' ')[1]?.charAt(0) || '') : 'S'}
          </span>
        </div>
        <div>
          {/* 👇 Real Name + Email */}
          <h4 className="font-bold text-xl text-slate-900">{user.name || user.fullName || 'Student Name'}</h4>
          <p className="text-sm text-slate-600">{user.email || user.collegeEmail || 'student@college.edu'}</p>
        </div>
      </div>
    </div>
    
    {/* Menu Items - Same as before */}
    <div className="py-2">
      <Link to="/student/profile" className="flex items-center gap-3 px-6 py-4 text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 rounded-2xl mx-2 font-semibold transition-all">
        <span className="text-xl">👤</span><span>View Profile</span>
      </Link>
      <Link to="/student/settings" className="flex items-center gap-3 px-6 py-4 text-slate-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-700 rounded-2xl mx-2 font-semibold transition-all">
        <span className="text-xl">⚙️</span><span>Settings</span>
      </Link>
      <hr className="mx-4 my-2 border-purple-100" />
      <button 
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('user');
          window.location.href = '/';
        }}
        className="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl mx-2 font-semibold transition-all hover:shadow-md"
      >
        <span className="text-xl">🚪</span><span>Logout</span>
      </button>
    </div>
  </div>
</div>


            
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100/50 group hover:-translate-y-2">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 bg-${stat.color}-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  <span className={`text-${stat.color}-600 text-2xl font-bold`}>{stat.icon}</span>
                </div>
                <div className="text-right">
                  <p className="text-slate-600 text-sm font-medium opacity-80">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-100/50 sticky top-24">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></span>
                Quick Actions
              </h3>
              <div className="space-y-4">
                <Link to="/student/events" className="group block p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🏃</span>
                    <span className="font-bold text-indigo-700 group-hover:text-indigo-800 text-lg">Browse All Events</span>
                  </div>
                  <p className="text-sm text-indigo-600 font-medium">Discover new events</p>
                </Link>
                
                <Link to="/student/registrations" className="group block p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
                    <span className="font-bold text-emerald-700 group-hover:text-emerald-800 text-lg">My Registrations</span>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">Track your events</p>
                </Link>
                
                <Link to="/student/completed-events" className="group block p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">✅</span>
                    <span className="font-bold text-orange-700 group-hover:text-orange-800 text-lg">Completed Events</span>
                  </div>
                  <p className="text-sm text-orange-600 font-medium">View history & certificates</p>
                </Link>
              </div>
            </div>

            {/* Next Event */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-8 shadow-2xl border-0">
              <h4 className="font-bold text-xl mb-4">Next Event</h4>
              <div className="space-y-2 mb-6">
                <h5 className="font-bold text-lg">Sports Fest 2026</h5>
                <p className="opacity-90 text-sm">Feb 15, 2026 • 2 days left</p>
                <p className="opacity-80 text-xs">SRM Campus, Chennai</p>
              </div>
              <Link to="/student/event/1" className="w-full block bg-white/20 backdrop-blur-sm rounded-2xl py-3 px-6 text-center font-semibold hover:bg-white/30 transition-all duration-300">
                View Details →
              </Link>
            </div>
          </div>

          {/* Recent Events */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-4xl font-black bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                Recent Events
              </h3>
              <Link to="/student/events" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:brightness-105 transition-all text-lg">
                Browse All Events →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentEvents.map((event) => (
                <StudentEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
