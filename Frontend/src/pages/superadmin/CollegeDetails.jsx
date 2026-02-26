import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

// ✅ FIX: Only these icons are confirmed valid in react-icons v5 fa6
// ❌ REMOVED (don't exist in fa6): FaIndianRupee, FaTicket, FaCheckCircle, FaMapPin, FaCalendarAlt
import {
  FaArrowLeft,
  FaUsers,
  FaChartLine,
  FaCalendarDays,
  FaMapLocationDot,
  FaCircleCheck,
} from "react-icons/fa6";

function CollegeDetails() {
  const { id } = useParams();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCollege({
        id: parseInt(id),
        name: "Madurai Kamaraj University",
        location: "Madurai, Tamil Nadu",
        admin: "Dr. Rajesh Kumar",
        email: "rajesh@mku.ac.in",
        phone: "+91 452 245 8471",
        totalEvents: 24,
        activeEvents: 21,
        pendingEvents: 3,
        totalStudents: 1247,
        totalRevenue: "₹45,200",
        rating: 4.8,
        joinedDate: "Jan 15, 2026",
        status: "active",
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading college details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button + Header */}
        <div className="flex items-center gap-6 mb-12">
          <Link
            to="/super-admin/colleges"
            className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-slate-700"
          >
            <FaArrowLeft /> Back to Colleges
          </Link>
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-2">
              {college.name}
            </h1>
            <div className="flex items-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <FaMapLocationDot className="text-indigo-500" />
                <span>{college.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCircleCheck className="text-emerald-500" />
                <span>Active Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-amber-600">
                  ★ {college.rating}
                </span>
                <span>(124 reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center group hover:shadow-2xl transition-all">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              🎉
            </div>
            <div className="text-4xl font-black text-purple-700 mb-2">
              {college.totalEvents}
            </div>
            <p className="text-slate-600 font-semibold text-lg">Total Events</p>
            <div className="text-sm text-emerald-600 mt-2 font-semibold">
              {college.activeEvents} active • {college.pendingEvents} pending
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center group hover:shadow-2xl transition-all">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              👥
            </div>
            <div className="text-4xl font-black text-emerald-700 mb-2">
              {college.totalStudents.toLocaleString()}
            </div>
            <p className="text-slate-600 font-semibold text-lg">
              Total Students
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center group hover:shadow-2xl transition-all">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              💰
            </div>
            <div className="text-4xl font-black text-amber-700 mb-2">
              {college.totalRevenue}
            </div>
            <p className="text-slate-600 font-semibold text-lg">
              Total Revenue
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center group hover:shadow-2xl transition-all">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              📅
            </div>
            <div className="text-4xl font-black text-indigo-700 mb-2">
              45 days
            </div>
            <p className="text-slate-600 font-semibold text-lg">Member Since</p>
            <div className="text-xs text-slate-500 mt-1">
              {college.joinedDate}
            </div>
          </div>
        </div>

        {/* Admin Details + Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <FaUsers className="text-indigo-600" />
              Admin Details
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  RK
                </div>
                <div>
                  <div className="font-bold text-xl text-slate-900">
                    {college.admin}
                  </div>
                  <div className="text-indigo-600 font-semibold">
                    {college.email}
                  </div>
                  <div className="text-slate-500">{college.phone}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                <Link
                  to="/super-admin/pending-events"
                  className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold text-center hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <FaCalendarDays /> Manage Events
                </Link>
                <button className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-xl transition-all">
                  Send Notification
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <FaChartLine className="text-amber-600" />
              Performance Metrics
            </h3>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-slate-700">
                    Revenue Growth
                  </span>
                  <span className="font-bold text-amber-700 text-lg">+28%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-slate-700">
                    Event Success Rate
                  </span>
                  <span className="font-bold text-emerald-700 text-lg">
                    94%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events Table */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              Recent Events
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
                21 Active
              </span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <th className="p-6 text-left font-bold text-slate-800">
                    Event
                  </th>
                  <th className="p-6 text-center font-bold text-slate-800">
                    Date
                  </th>
                  <th className="p-6 text-center font-bold text-slate-800">
                    Tickets Sold
                  </th>
                  <th className="p-6 text-center font-bold text-slate-800">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-6 font-semibold">TechFest 2026</td>
                  <td className="p-6 text-center">Mar 15-17</td>
                  <td className="p-6 text-center font-bold text-emerald-600">
                    1,247
                  </td>
                  <td className="p-6 text-center font-bold text-amber-600">
                    ₹45,200
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-6 font-semibold">Cultural Night</td>
                  <td className="p-6 text-center">Feb 28</td>
                  <td className="p-6 text-center font-bold text-emerald-600">
                    892
                  </td>
                  <td className="p-6 text-center font-bold text-amber-600">
                    ₹32,500
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeDetails;
