import { Link } from "react-router-dom";
import Chatbot from '../components/Chatbot'; 
function CollegeAdminDashboard() {



  const collegeStats = [
    { label: "Total Events", value: "24", subtitle: "12 active", icon: "🎉", color: "purple" },
    { label: "Registrations", value: "1,247", subtitle: "+23% this month", icon: "📋", color: "blue" },
    { label: "Pending Approval", value: "3", subtitle: "New events", icon: "⏳", color: "orange" },
    { label: "Revenue", value: "₹45,200", subtitle: "From fees", icon: "₹", color: "emerald" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-purple-50">
      {/* Admin Navbar */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="font-bold text-xl text-slate-900">SRM Institute Admin</h2>
              <p className="text-sm text-slate-500">College Event Coordinator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* PROFILE DROPDOWN */}
      <div className="relative group">
        <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 transition-all duration-200">
          <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div className="hidden md:block">
            <p className="font-semibold text-slate-900 text-sm">Admin</p>
            <p className="text-xs text-slate-500">SRM Institute</p>
          </div>
          <svg className="w-4 h-4 text-slate-500 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 py-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 scale-95 group-hover:scale-100">
          <Link to="/admin/profile" className="flex items-center gap-4 px-6 py-4 hover:bg-linear-to-r hover:from-purple-50 hover:to-indigo-50 rounded-2xl mx-2 font-semibold text-slate-900 transition-all">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Edit Profile
          </Link>
          
          <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent my-2 mx-4"></div>
          
          <button className="w-full text-left px-6 py-4 hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 rounded-2xl mx-2 font-semibold text-slate-900 transition-all">
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
              Logout
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
            
         
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {collegeStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl group transition-all border border-purple-100/50">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 bg-${stat.color}-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110`}>
                  <span className={`text-${stat.color}-600 text-2xl`}>{stat.icon}</span>
                </div>
                <div>
                  <Chatbot />
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Quick Actions</h3>
              <div className="space-y-4">
                <Link to="/admin/create-event" className="group block p-6 rounded-2xl bg-linear-to-r from-purple-50 to-indigo-50 border-2 border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">➕</span>
                    <span className="font-bold text-purple-700 group-hover:text-purple-800">Create Event</span>
                  </div>
                </Link>
                <Link to="/admin/registrations" className="group block p-6 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border-2 border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📋</span>
                    <span className="font-bold text-emerald-700">Manage Registrations</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-3xl font-black text-slate-900">Recent Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Event Cards */}
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl group border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-xl text-slate-900">Hackathon 2026</h4>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">127 slots</span>
                </div>
                <div className="space-y-3 text-sm text-slate-600 mb-6">
                  <div>📅 Feb 20-22</div>
                  <div>👥 127/200 registered</div>
                </div>
                <Link to="/admin/event-details" className="w-full block bg-linear-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-2xl text-center font-bold hover:brightness-105">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

<div className="flex items-center gap-4 relative">
  <Link to="/student/dashboard" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
    Student View
  </Link>
  
  {/* Profile Dropdown */}
  <div className="relative">
    <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-all">
      <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold">A</span>
      </div>
      <span className="font-semibold text-slate-900 hidden md:block">Admin</span>
      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    {/* Dropdown Menu */}
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 hidden group-hover:block">
      <Link to="/admin/profile" className="flex items-center gap-3 px-6 py-4 text-slate-900 hover:bg-slate-50 rounded-xl font-semibold">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Edit Profile
      </Link>
      <div className="border-t border-slate-100 my-1"></div>
      <button className="w-full text-left px-6 py-4 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold">
        Logout
      </button>
    </div>
  </div>
</div>


export default CollegeAdminDashboard;
