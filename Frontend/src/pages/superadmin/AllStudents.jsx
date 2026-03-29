// src/pages/superadmin/AllStudents.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import {
  FaSearch, FaUsers, FaTicketAlt, FaCalendarAlt,
  FaMapMarkerAlt, FaArrowLeft, FaTimes, FaCheckCircle,
  FaHourglassHalf, FaTimesCircle, FaEye,
} from "react-icons/fa";

const STATUS_CFG = {
  approved: { label:"Approved", chip:"bg-emerald-100 text-emerald-700", icon:<FaCheckCircle/>  },
  pending:  { label:"Pending",  chip:"bg-amber-100 text-amber-700",    icon:<FaHourglassHalf/>},
  rejected: { label:"Rejected", chip:"bg-red-100 text-red-700",        icon:<FaTimesCircle/>  },
};

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-600","from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500","from-pink-500 to-rose-600",
  "from-violet-500 to-purple-700","from-amber-500 to-yellow-500",
];
const avColor = (name="") => { let s=0; for(const c of name) s+=c.charCodeAt(0); return AVATAR_COLORS[s%AVATAR_COLORS.length]; };

export default function AllStudents() {
  const [students,    setStudents]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [selected,    setSelected]    = useState(null); // student object
  const [regs,        setRegs]        = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [regFilter,   setRegFilter]   = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/superadmin/students");
        setStudents(data.students || []);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const openStudent = async (student) => {
    setSelected(student);
    setRegs([]);
    setRegFilter("all");
    try {
      setLoadingRegs(true);
      const { data } = await api.get(`/superadmin/students/${student._id}/registrations`);
      setRegs(data.registrations || []);
    } catch(e) { console.error(e); }
    finally { setLoadingRegs(false); }
  };

  const filtered = students.filter(s =>
    !search ||
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.college?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRegs = regFilter === "all" ? regs : regs.filter(r => r.status === regFilter);
  const regCounts = {
    all:      regs.length,
    approved: regs.filter(r=>r.status==="approved").length,
    pending:  regs.filter(r=>r.status==="pending").length,
    rejected: regs.filter(r=>r.status==="rejected").length,
  };

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/super-admin/dashboard"
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm">
              <FaArrowLeft className="text-slate-600"/>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900">All Students</h1>
              <p className="text-slate-500 mt-0.5 text-sm">
                {loading ? "Loading..." : `${students.length} registered students`}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-lg mb-6">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="Search by name, email or college..."
              value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"/>
          </div>

          {/* Students Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i=><div key={i} className="h-32 bg-white rounded-2xl animate-pulse shadow-sm"/>)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
              <FaUsers className="text-6xl text-slate-200 mx-auto mb-4"/>
              <p className="text-slate-500 font-bold text-lg">No students found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(student => (
                <div key={student._id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avColor(student.name)} flex items-center justify-center font-black text-white text-lg flex-shrink-0`}>
                      {student.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800 truncate">{student.name}</p>
                      <p className="text-xs text-slate-500 truncate">{student.email}</p>
                      <p className="text-xs text-slate-400 mt-0.5">🏫 {student.college}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                      <FaTicketAlt className="text-xs"/> {student.registrationCount} registrations
                    </span>
                    <button onClick={()=>openStudent(student)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all">
                      <Link to={`/super-admin/students/${student._id}`}>
                        View
                      </Link>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Student Registrations Modal ───────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

            {/* Modal header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avColor(selected.name)} flex items-center justify-center font-black text-white text-lg`}>
                  {selected.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="font-black text-xl text-slate-900">{selected.name}</h2>
                  <p className="text-sm text-slate-500">{selected.email} · {selected.college}</p>
                </div>
              </div>
              <button onClick={()=>setSelected(null)}
                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all">
                <FaTimes className="text-slate-600"/>
              </button>
            </div>

            {/* Filter pills */}
            <div className="px-6 py-4 border-b border-slate-100 flex gap-2 flex-wrap flex-shrink-0">
              {[
                {id:"all",      label:`All (${regCounts.all})`            },
                {id:"approved", label:`✅ Approved (${regCounts.approved})`},
                {id:"pending",  label:`⏳ Pending (${regCounts.pending})`  },
                {id:"rejected", label:`❌ Rejected (${regCounts.rejected})`},
              ].map(f=>(
                <button key={f.id} onClick={()=>setRegFilter(f.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    regFilter===f.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Registrations list */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingRegs ? (
                <div className="space-y-3">
                  {[1,2,3].map(i=><div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"/>)}
                </div>
              ) : filteredRegs.length === 0 ? (
                <div className="py-16 text-center">
                  <FaCalendarAlt className="text-5xl text-slate-200 mx-auto mb-3"/>
                  <p className="text-slate-500 font-semibold">
                    {regFilter==="all" ? "No registrations yet" : `No ${regFilter} registrations`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRegs.map(reg => {
                    const ev  = reg.event_id || {};
                    const st  = reg.user_id || {};
                    return (
                      <div key={reg._id}
                        className="flex items-center justify-between gap-4 p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-2xl transition-all">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate">{ev.title || "Event"}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
                            {ev.category && (
                              <span className="font-semibold text-indigo-500 capitalize">{ev.category}</span>
                            )}
                            {ev.location && (
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-slate-400"/> {ev.location}
                              </span>
                            )}
                            {ev.start_date && (
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt className="text-slate-400"/>
                                {new Date(ev.start_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                              </span>
                            )}
                            {ev.collegeName && (
                              <span>🏫 {ev.collegeName}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Registered {new Date(reg.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 ${cfg.chip}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}