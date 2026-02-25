import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../../services/auth";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar"

function CollegeAdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/");
  };

  const collegeStats = [
    {
      label: "Total Events",
      value: "24",
      subtitle: "12 active",
      icon: "🎉",
      color: "purple",
    },
    {
      label: "Registrations",
      value: "1,247",
      subtitle: "+23% this month",
      icon: "📋",
      color: "blue",
    },
    {
      label: "Pending Approval",
      value: "3",
      subtitle: "New events",
      icon: "⏳",
      color: "orange",
    },
    {
      label: "Revenue",
      value: "₹45,200",
      subtitle: "From fees",
      icon: "₹",
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-purple-50">
      {/* Admin Navbar */}
     <Navbar />
     
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {collegeStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl group transition-all border border-purple-100/50"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-16 h-16 bg-${stat.color}-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110`}
                >
                  <span className={`text-${stat.color}-600 text-2xl`}>
                    {stat.icon}
                  </span>
                </div>
                <div>
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">
                    {stat.value}
                  </p>
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
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <Link
                  to="/admin/dashboard/create-event"
                  className="group block p-6 rounded-2xl bg-linear-to-r from-purple-50 to-indigo-50 border-2 border-purple-100"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">➕</span>
                    <span className="font-bold text-purple-700 group-hover:text-purple-800">
                      Create Event
                    </span>
                  </div>
                </Link>
                <Link
                  to="/admin/dashboard/events/registrations"
                  className="group block p-6 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border-2 border-emerald-100"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📋</span>
                    <span className="font-bold text-emerald-700">
                      Manage Registrations
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-3xl font-black text-slate-900">
              Recent Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl group border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-xl text-slate-900">
                    Hackathon 2026
                  </h4>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                    127 slots
                  </span>
                </div>
                <div className="space-y-3 text-sm text-slate-600 mb-6">
                  <div>📅 Feb 20-22</div>
                  <div>👥 127/200 registered</div>
                </div>
                <Link
                  to="/admin/event-details"
                  className="w-full block bg-linear-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-2xl text-center font-bold hover:brightness-105"
                >
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

export default CollegeAdminDashboard;
