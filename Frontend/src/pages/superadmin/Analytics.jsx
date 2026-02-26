import { useState } from "react";
import Navbar from "../../components/Navbar";
import { 
  FaChartLine, FaChartBar, FaUsers, FaTicket, FaIndianRupee, 
  FaCalendarDays, FaMapLocationDot, FaDownload 
} from "react-icons/fa6";
function Analytics() {
  const [dateRange, setDateRange] = useState("30days");

  const stats = {
    colleges: 47,
    events: 156,
    students: 24500,
    revenue: "₹8.25L",
    growth: "+28%"
  };

  // Chart data (for CSS-based charts)
  const revenueData = [12000, 18500, 32000, 45200, 82500];
  const eventData = [25, 42, 78, 112, 156];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Analytics Dashboard
            </h1>
            <p className="text-2xl text-slate-600 font-semibold">Platform-wide performance overview</p>
          </div>
          <div className="flex gap-3">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 focus:border-indigo-500 focus:ring-4 ring-indigo-100 transition-all"
            >
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
              <option value="90days">90 Days</option>
              <option value="all">All Time</option>
            </select>
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl flex items-center gap-2 transition-all">
              <FaDownload /> Export Report
            </button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 text-center group hover:shadow-3xl transition-all">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🏫</div>
            <div className="text-4xl font-black text-indigo-700 mb-2">{stats.colleges}</div>
            <p className="text-xl text-slate-600 font-semibold">Active Colleges</p>
            <div className="text-sm text-emerald-600 mt-3 font-bold flex items-center justify-center gap-1">
              +12% <FaChartLine className="text-xs" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 text-center group hover:shadow-3xl transition-all">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🎉</div>
            <div className="text-4xl font-black text-purple-700 mb-2">{stats.events}</div>
            <p className="text-xl text-slate-600 font-semibold">Total Events</p>
            <div className="text-sm text-emerald-600 mt-3 font-bold flex items-center justify-center gap-1">
              +45% <FaChartLine className="text-xs" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 text-center group hover:shadow-3xl transition-all">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">👥</div>
            <div className="text-4xl font-black text-emerald-700 mb-2">{stats.students.toLocaleString()}</div>
            <p className="text-xl text-slate-600 font-semibold">Total Students</p>
            <div className="text-sm text-emerald-600 mt-3 font-bold flex items-center justify-center gap-1">
              +67% <FaChartLine className="text-xs" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 text-center group hover:shadow-3xl transition-all">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">💰</div>
            <div className="text-4xl font-black text-amber-700 mb-2">{stats.revenue}</div>
            <p className="text-xl text-slate-600 font-semibold">Total Revenue</p>
            <div className="text-sm text-emerald-600 mt-3 font-bold flex items-center justify-center gap-1">
              {stats.growth} <FaChartLine className="text-xs" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Chart */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <FaChartLine className="text-amber-600" />
              Revenue Growth
            </h3>
            <div className="space-y-6">
              {/* Sparkline Chart */}
              <div className="flex items-end gap-1 h-32 bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-3xl border border-amber-200">
                {revenueData.map((value, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-amber-500 to-orange-600 rounded-lg flex-1 group hover:scale-110 transition-all"
                    style={{
                      height: `${(value / Math.max(...revenueData)) * 100}%`
                    }}
                  >
                    <div className="absolute bottom-0 w-full bg-amber-700/90 text-white text-xs py-1 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity font-bold text-center">
                      ₹{value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-amber-700 mb-1">₹82,500</div>
                <p className="text-slate-600 font-semibold">Monthly Revenue Peak</p>
              </div>
            </div>
          </div>

          {/* Events Chart */}
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <FaChartBar className="text-emerald-600" />
              Event Growth
            </h3>
            <div className="space-y-6">
              {/* Bar Chart */}
              <div className="grid grid-cols-5 gap-2 h-32 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 items-end">
                {eventData.map((value, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-emerald-500 to-teal-600 rounded-lg flex-1 relative group hover:scale-110 transition-all cursor-pointer"
                    style={{ height: `${(value / Math.max(...eventData)) * 100}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-emerald-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-700 mb-1">156 Events</div>
                <p className="text-slate-600 font-semibold">Total Events Created</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Top Colleges */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 md:col-span-2">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              Top Performing Colleges
            </h3>
            <div className="space-y-4">
              {[
                { name: "MKU Madurai", revenue: "₹45.2K", events: 24 },
                { name: "TCE Madurai", revenue: "₹32.5K", events: 18 },
                { name: "VIT Vellore", revenue: "₹78.9K", events: 35 }
              ].map((college, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{college.name}</div>
                      <div className="text-sm text-slate-500">{college.events} events</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-amber-700">{college.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all flex items-center gap-3">
                <FaCalendarAlt /> View Events
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all flex items-center gap-3">
                <FaUsers /> Manage Colleges
              </button>
              <button className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold hover:shadow-xl transition-all flex items-center gap-3">
                <FaTicketAlt /> Pending Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
