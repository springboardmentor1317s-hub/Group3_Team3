import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar"

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
      <Navbar />


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
