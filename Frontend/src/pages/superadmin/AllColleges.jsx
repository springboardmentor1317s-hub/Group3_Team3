import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaCircleCheck, FaCircleXmark, FaEye } from "react-icons/fa6";
function AllColleges() {
  const [colleges, setColleges] = useState([
    {
      id: 1,
      name: "Madurai Kamaraj University",
      location: "Madurai, TN",
      events: 24,
      students: 1247,
      revenue: "₹45,200",
      status: "active",
      admin: "Dr. Rajesh K",
      pendingEvents: 3
    },
    {
      id: 2,
      name: "Thiagarajar College of Engineering",
      location: "Madurai, TN", 
      events: 18,
      students: 892,
      revenue: "₹32,500",
      status: "active",
      admin: "Prof. Kumar S",
      pendingEvents: 1
    },
    {
      id: 3,
      name: "VIT Vellore",
      location: "Vellore, TN",
      events: 35,
      students: 2456,
      revenue: "₹78,900",
      status: "active",
      admin: "Dr. Anjali R",
      pendingEvents: 0
    }
  ]);

  const approveCollege = (id) => {
    setColleges(colleges.map(c => c.id === id ? { ...c, status: "active" } : c));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">All Colleges</h1>
            <p className="text-xl text-slate-600">Manage 47 active colleges</p>
          </div>
          <Link to="/super-admin/pending-colleges" className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
            Pending Colleges (5)
          </Link>
        </div>

        {/* College Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3">🏫</div>
            <div className="text-3xl font-black text-indigo-700">47</div>
            <p className="text-slate-600 font-semibold">Active Colleges</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <div className="text-3xl font-black text-purple-700">1,247</div>
            <p className="text-slate-600 font-semibold">Total Events</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3">👥</div>
            <div className="text-3xl font-black text-emerald-700">24,500</div>
            <p className="text-slate-600 font-semibold">Total Students</p>
          </div>
        </div>

        {/* Colleges Table */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">College Directory</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-100">
                  <th className="p-6 text-left font-bold text-slate-800 text-lg">College</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">Events</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">Students</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">Revenue</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">Status</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((college) => (
                  <tr key={college.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-6 font-semibold text-slate-900">
                      <div>
                        <div className="font-bold text-xl">{college.name}</div>
                        <div className="text-sm text-slate-500">{college.location}</div>
                        <div className="text-xs text-slate-400">Admin: {college.admin}</div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="font-bold text-2xl text-purple-600">{college.events}</div>
                      <div className="text-sm text-slate-500">{college.pendingEvents} pending</div>
                    </td>
                    <td className="p-6 text-center font-bold text-2xl text-emerald-600">{college.students.toLocaleString()}</td>
                    <td className="p-6 text-center font-bold text-xl text-amber-600">{college.revenue}</td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        college.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {college.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Link 
                          to={`/super-admin/colleges/${college.id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all"
                          title="View Details"
                        >
                          <FaEye />
                        </Link>
                        {college.status !== 'active' && (
                          <button
                            onClick={() => approveCollege(college.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllColleges;
