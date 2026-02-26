import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function SuperAdminDashboard() {
  const [profile, setProfile] = useState({
    name: "Platform Super Admin",
    email: "super@eventhub.com"
  });

  const systemStats = [
    { label: "Total Colleges", value: "47", subtitle: "+12% MoM", icon: "🏫", color: "indigo" },
    { label: "Total Events", value: "156", subtitle: "+45% MoM", icon: "🎉", color: "purple" },
    { label: "Total Students", value: "24.5K", subtitle: "Active users", icon: "👥", color: "emerald" },
    { label: "Platform Revenue", value: "₹8.25L", subtitle: "This month", icon: "💰", color: "amber" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-xl text-slate-600 mt-2 font-semibold">Platform-wide performance overview</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
            <span>👋 Welcome back,</span>
            <span className="font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              {profile.name}
            </span>
          </div>
        </div>

        {/* Platform Stats - Screenshot Match */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {systemStats.map((stat, index) => (
            <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-purple-100/50 hover:border-purple-200/70 transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-20 h-20 bg-gradient-to-br from-${stat.color}-500 via-${stat.color}-600 to-${stat.color}-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-purple-200/50`}>
                  <span className="text-3xl font-bold">{stat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-600 text-sm font-medium mb-1 truncate">{stat.label}</p>
                  <p className="text-4xl lg:text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent leading-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-600 font-semibold bg-emerald-100/50 px-3 py-1 rounded-full inline-flex items-center gap-1 w-fit">
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content Grid - Screenshot Match */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Platform Activity + Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Platform Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-100/50">
              <h3 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                📊 Platform Activity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-100 hover:shadow-lg transition-all">
                  <div className="text-5xl mb-6">📈</div>
                  <div className="text-4xl font-black text-purple-700 mb-3">78%</div>
                  <p className="text-xl text-slate-600 font-semibold">Live Events</p>
                  <p className="text-sm text-slate-500 mt-2">1247 events running</p>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100 hover:shadow-lg transition-all">
                  <div className="text-5xl mb-6">⚡</div>
                  <div className="text-4xl font-black text-emerald-700 mb-3">94%</div>
                  <p className="text-xl text-slate-600 font-semibold">Engagement Rate</p>
                  <p className="text-sm text-slate-500 mt-2">24.5K active users</p>
                </div>
              </div>
            </div>

            {/* College Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-100/50">
              <h3 className="text-3xl font-bold text-slate-900 mb-6">🏫 College Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">🏫</div>
                  <div className="text-3xl font-black text-indigo-700">47</div>
                  <p className="text-slate-600 font-semibold">Active Colleges</p>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100 hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">📈</div>
                  <div className="text-3xl font-black text-emerald-700">+23%</div>
                  <p className="text-slate-600 font-semibold">Monthly Growth</p>
                </div>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100 hover:shadow-lg transition-all">
                  <div className="text-4xl mb-4">⭐</div>
                  <div className="text-3xl font-black text-amber-700">4.8</div>
                  <p className="text-slate-600 font-semibold">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Quick Actions */}
          <div className="space-y-6">
            <Link to="/super-admin/colleges" className="block bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all text-center font-bold text-2xl group">
              <span className="block mb-3 text-4xl">🏫</span>
              <span>All Colleges</span>
              <span className="text-sm block mt-2 text-indigo-100 opacity-90 group-hover:opacity-100">View & Manage</span>
            </Link>
            
            <Link to="/super-admin/reports" className="block bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all text-center font-bold text-2xl group">
              <span className="block mb-3 text-4xl">📊</span>
              <span>Analytics</span>
              <span className="text-sm block mt-2 text-emerald-100 opacity-90 group-hover:opacity-100">Reports & Charts</span>
            </Link>
            
            <Link to="/super-admin/pending-colleges" className="block bg-gradient-to-r from-orange-500 to-red-600 text-white p-10 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all text-center font-bold text-2xl relative group">
              <span className="block mb-3 text-4xl">⏳</span>
              <span>Pending Colleges</span>
              <span className="absolute -top-3 -right-3 bg-red-500 text-white px-4 py-2 rounded-2xl text-lg font-bold shadow-lg">5</span>
              <span className="text-sm block mt-2 text-orange-100 opacity-90 group-hover:opacity-100">Review Requests</span>
            </Link>
          </div>
        </div>

        {/* Bottom Quick Actions - Screenshot Match */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 pt-12 border-t-2 border-purple-100/50">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-2 border-purple-200/50 text-center hover:shadow-xl transition-all cursor-pointer group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
            <div className="font-bold text-xl mb-2 text-purple-800">Manage Users</div>
            <p className="text-sm text-slate-600">Admin logins</p>
          </div>
          <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-200/50 text-center hover:shadow-xl transition-all cursor-pointer group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">💰</div>
            <div className="font-bold text-xl mb-2 text-emerald-800">View Events</div>
            <p className="text-sm text-slate-600">All events list</p>
          </div>
          <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-200/50 text-center hover:shadow-xl transition-all cursor-pointer group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">⭐</div>
            <div className="font-bold text-xl mb-2 text-amber-800">User Logs</div>
            <p className="text-sm text-slate-600">Activity logs</p>
          </div>
          <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-500/10 to-slate-400/10 border-2 border-slate-200/50 text-center hover:shadow-xl transition-all cursor-pointer group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
            <div className="font-bold text-xl mb-2 text-slate-800">Settings</div>
            <p className="text-sm text-slate-600">Platform config</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
