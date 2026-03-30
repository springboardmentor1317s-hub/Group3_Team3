// src/pages/superadmin/AllColleges.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { FaCircleCheck, FaCircleXmark, FaEye } from "react-icons/fa6";
import { FaSearch, FaUsers, FaGraduationCap, FaCalendarAlt, FaClock } from "react-icons/fa";

function AllColleges() {
  const [admins,     setAdmins]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter,     setFilter]     = useState("all"); // all | approved | pending

  useEffect(() => {
    // ✅ FIXED: uses new superadmin API
    api.get("/superadmin/college-admins")
      .then((res) => setAdmins(res.data.admins || []))
      .catch((err) => console.error("Failed to load college admins", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = admins.filter((a) => {
    const matchSearch =
      !searchTerm ||
      a.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter =
      filter === "all" ;

    return matchSearch && matchFilter;
  });

  const counts = {
    all:      admins.length,
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-1">All Colleges</h1>
            <p className="text-slate-500">Colleges registered on the platform</p>
          </div>
          
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label:"Total Colleges",  value:counts.all,      color:"from-indigo-500 to-purple-600" },

          ].map((s,i)=>(
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <FaGraduationCap className="text-white text-xl"/>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="bg-white/80 rounded-3xl p-5 shadow border border-white/50 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-52">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by college, admin name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              {[
                { id:"all",      label:`All (${counts.all})`           },
            
              ].map((f)=>(
                <button key={f.id} onClick={()=>setFilter(f.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    filter===f.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-3xl shadow border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <FaGraduationCap /> Colleges ({filtered.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse"/>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FaGraduationCap className="text-7xl mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold">No colleges found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((admin) => (
                <div key={admin._id}
                  className="px-8 py-5 hover:bg-slate-50 flex items-center justify-between gap-4 flex-wrap transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {admin.college?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{admin.college}</p>
                      <p className="text-sm text-slate-500">
                        Admin: {admin.name} · {admin.email}
                      </p>
                      {/* Event count badge */}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-indigo-600 font-semibold">
                          <FaCalendarAlt className="text-indigo-400"/> {admin.eventCount || 0} events
                        </span>
                        <span className="text-xs text-slate-400">
                          <FaClock className="inline mr-1 text-slate-300"/>
                          Joined {new Date(admin.createdAt).toLocaleDateString("en-IN", { month:"short", year:"numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Approval status badge */}
                    {admin.isApproved ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <FaCircleCheck /> Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1">
                        
                      </span>
                    )}
                    <Link
                      to={`/super-admin/colleges/${admin._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-200 transition-all"
                    >
                      <FaEye /> View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AllColleges;