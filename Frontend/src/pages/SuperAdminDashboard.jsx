import { useState } from "react";
import { Link } from "react-router-dom";

function SuperAdminDashboard() {
  const [profile, setProfile] = useState({
    name: "Platform Super Admin",
    email: "super@eventhub.com"
  });

  const systemStats = [
    { label: "Total Colleges", value: "47", subtitle: "+5 this month", icon: "🏫", color: "indigo" },
    { label: "Total Events", value: "1,247", subtitle: "Across all colleges", icon: "🎉", color: "purple" },
    { label: "Total Students", value: "24,500", subtitle: "Registered users", icon: "👥", color: "emerald" },
    { label: "Platform Revenue", value: "₹2.4L", subtitle: "This month", icon: "₹", color: "amber" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50">
      {/* Super Admin Navbar */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
              <span className="text-white font-black text-2xl">SA</span>
            </div>
            <div>
              <h2 className="font-black text-2xl text-slate-900">{profile.name}</h2>
              <p className="text-sm text-slate-500">CampusEventHub Platform</p>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 transition-all duration-200">
              <div className="w-12 h-12 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/50">
                <span className="text-white font-bold text-lg">SA</span>
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-slate-900 text-sm">Super Admin</p>
                <p className="text-xs text-slate-500">Platform Owner</p>
              </div>
              <svg className="w-4 h-4 text-slate-500 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 py-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 scale-95 group-hover:scale-100">
              
              {/* Profile Preview */}
              <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">SA</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{profile.name}</p>
                    <p className="text-sm text-slate-500">{profile.email}</p>
                  </div>
                </div>
              </div>

              {/* Edit Profile Link */}
              <div className="px-6 py-4">
                <Link 
                  to="/super-admin/profile"
                  className="w-full flex items-center gap-3 px-6 py-4 hover:bg-linear-to-r hover:from-indigo-50 hover:to-purple-50 rounded-2xl font-semibold text-slate-900 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H8a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V8a2 2 0 00-2-2z" />
                  </svg>
                  Edit Profile
                </Link>
              </div>

              <div className="px-6 py-3 border-t border-slate-100">
                <button className="w-full text-left px-4 py-3 hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 rounded-2xl font-semibold text-slate-800 transition-all text-sm">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {systemStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl group border border-indigo-100/50">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-20 h-20 bg-linear-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all`}>
                  <span className="text-white text-3xl font-bold">{stat.icon}</span>
                </div>
                <div className="text-right">
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-10 shadow-2xl border border-slate-100">
            <h3 className="text-4xl font-black text-slate-900 mb-8">College Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-8 rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100">
                <div className="text-4xl mb-4">🏫</div>
                <div className="text-3xl font-black text-indigo-700">47</div>
                <p className="text-slate-600 font-semibold">Active Colleges</p>
              </div>
              <div className="text-center p-8 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100">
                <div className="text-4xl mb-4">📈</div>
                <div className="text-3xl font-black text-emerald-700">+23%</div>
                <p className="text-slate-600 font-semibold">Monthly Growth</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Link to="/super-admin/colleges" className="block bg-linear-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all text-center font-bold text-xl">
              Manage Colleges
            </Link>
            <Link to="/super-admin/reports" className="block bg-linear-to-r from-emerald-500 to-teal-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all text-center font-bold text-xl">
              Analytics Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;