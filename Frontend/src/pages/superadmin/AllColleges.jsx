// src/pages/superadmin/AllColleges.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { FaCircleCheck, FaCircleXmark, FaEye } from "react-icons/fa6";
import { FaSearch, FaUsers, FaGraduationCap } from "react-icons/fa";

function AllColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all college_admin users — each represents a college
    api
      .get("/users?role=college_admin")
      .then((res) => {
        const users = res.data.users || res.data || [];
        // Group by college name
        const collegeMap = {};
        users.forEach((u) => {
          if (!collegeMap[u.college]) {
            collegeMap[u.college] = {
              id: u._id,
              name: u.college,
              admin: u.name,
              email: u.email,
              status: "active",
            };
          }
        });
        setColleges(Object.values(collegeMap));
      })
      .catch((err) => console.error("Failed to load colleges", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = colleges.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-1">
              All Colleges
            </h1>
            <p className="text-slate-500">
              Colleges registered on the platform
            </p>
          </div>
          <Link
            to="/super-admin/pending-colleges"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Pending Colleges
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white/80 rounded-3xl p-5 shadow border border-white/50 mb-8">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none"
            />
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
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-slate-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FaGraduationCap className="text-7xl mx-auto mb-4 opacity-20" />
              <p className="text-xl font-bold">No colleges found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((college) => (
                <div
                  key={college.id}
                  className="px-8 py-5 hover:bg-slate-50 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {college.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{college.name}</p>
                      <p className="text-sm text-slate-500">
                        Admin: {college.admin} • {college.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <FaCircleCheck /> Active
                    </span>
                    <Link
                      to={`/super-admin/colleges/${college.id}`}
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
