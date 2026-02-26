import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaCircleCheck, FaCircleXmark, FaEye, FaCalendarDays, FaMapLocationDot } from "react-icons/fa6";
function PendingColleges() {
  const [pendingColleges, setPendingColleges] = useState([
    {
      id: 1,
      name: "St. Joseph's College",
      location: "Tiruchirappalli, TN",
      admin: "Dr. Maria Thomas",
      email: "maria@stjosephs.ac.in",
      events: 0,
      students: 0,
      appliedDate: "Feb 20, 2026",
      documents: "Verified ✅"
    },
    {
      id: 2,
      name: "Bharathidasan University",
      location: "Tiruchirappalli, TN", 
      admin: "Prof. Ravi Shankar",
      email: "ravi@bdu.ac.in",
      events: 0,
      students: 0,
      appliedDate: "Feb 22, 2026",
      documents: "Pending"
    },
    {
      id: 3,
      name: "Kalasalingam Academy",
      location: "Virudhunagar, TN",
      admin: "Dr. Priya S",
      email: "priya@kalasalingam.ac.in",
      events: 0,
      students: 0,
      appliedDate: "Feb 23, 2026",
      documents: "Verified ✅"
    }
  ]);

  const approveCollege = (id) => {
    setPendingColleges(prev => prev.filter(c => c.id !== id));
  };

  const rejectCollege = (id) => {
    setPendingColleges(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'rejected' } : c
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Pending Colleges</h1>
            <p className="text-xl text-slate-600">Review new college registrations (5 pending)</p>
          </div>
          <Link to="/super-admin/colleges" className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl">
            View All Colleges →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3 text-orange-500">⏳</div>
            <div className="text-3xl font-black text-orange-700">5</div>
            <p className="text-slate-600 font-semibold">Pending Approval</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3 text-emerald-500">✅</div>
            <div className="text-3xl font-black text-emerald-700">42</div>
            <p className="text-slate-600 font-semibold">Active Colleges</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3 text-red-500">❌</div>
            <div className="text-3xl font-black text-red-700">0</div>
            <p className="text-slate-600 font-semibold">Rejected</p>
          </div>
        </div>

        {/* Pending Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pendingColleges.map((college) => (
            <div key={college.id} className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl border border-orange-100 overflow-hidden group">
              {/* College Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FaUniversity className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{college.name}</h3>
                    <p className="text-orange-100">{college.location}</p>
                  </div>
                </div>
              </div>

              {/* College Details */}
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Admin</span>
                    <span className="font-semibold text-slate-900">{college.admin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Email</span>
                    <span className="font-semibold text-indigo-600">{college.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Applied</span>
                    <span className="text-sm text-slate-500">{college.appliedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Documents</span>
                    <span className={`text-sm font-semibold ${
                      college.documents === 'Verified ✅' 
                        ? 'text-emerald-600' 
                        : 'text-orange-600'
                    }`}>
                      {college.documents}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <Link
                    to={`/super-admin/colleges/${college.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all"
                  >
                    <FaEye /> View Details
                  </Link>
                  <button
                    onClick={() => approveCollege(college.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all"
                  >
                    <FaCheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => rejectCollege(college.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all"
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pendingColleges.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-4xl text-emerald-600" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">No pending colleges!</h3>
            <p className="text-xl text-slate-600 mb-8">All college registrations are approved</p>
            <Link to="/super-admin/colleges" className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold">
              View All Colleges
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingColleges;
