// src/pages/superadmin/AllRegistrations.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import {
  FaSearch, FaFilter, FaTicketAlt, FaCalendarAlt,
  FaMapMarkerAlt, FaArrowLeft, FaCheckCircle,
  FaHourglassHalf, FaTimesCircle, FaUsers,
} from "react-icons/fa";

const STATUS_CFG = {
  approved:{ label:"Approved", chip:"bg-emerald-100 text-emerald-700 border-emerald-200", dot:"bg-emerald-500", icon:<FaCheckCircle/>  },
  pending: { label:"Pending",  chip:"bg-amber-100 text-amber-700 border-amber-200",       dot:"bg-amber-400",   icon:<FaHourglassHalf/>},
  rejected:{ label:"Rejected", chip:"bg-red-100 text-red-700 border-red-200",             dot:"bg-red-400",     icon:<FaTimesCircle/>  },
};

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-600","from-emerald-500 to-teal-600",
  "from-orange-500 to-red-500","from-pink-500 to-rose-600",
];
const avColor = (name="") => { let s=0; for(const c of name) s+=c.charCodeAt(0); return AVATAR_COLORS[s%AVATAR_COLORS.length]; };

export default function AllRegistrations() {
  const [registrations, setRegs]        = useState([]);
  const [events,        setEvents]       = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [search,        setSearch]       = useState("");
  const [statusFilter,  setStatus]       = useState("all");
  const [eventFilter,   setEventFilter]  = useState("");

  useEffect(() => {
    fetchAll();
    fetchEvents();
  }, []);

  const fetchAll = async (params={}) => {
    try {
      setLoading(true);
      const query = new URLSearchParams(params).toString();
      const { data } = await api.get(`/superadmin/registrations${query ? "?"+query : ""}`);
      setRegs(data.registrations || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data.events || []);
    } catch(e) { console.error(e); }
  };

  // Client-side filter
  const filtered = registrations.filter((r) => {
  const student = r.student || r.user_id || {};
  const event = r.event || r.event_id || {};

  const matchStatus =
    statusFilter === "all" || r.status === statusFilter;

  const matchEvent =
    !eventFilter || event._id === eventFilter;

  const matchSearch =
    !search ||
    student.name?.toLowerCase().includes(search.toLowerCase()) ||
    student.email?.toLowerCase().includes(search.toLowerCase()) ||
    student.college?.toLowerCase().includes(search.toLowerCase()) ||
    event.title?.toLowerCase().includes(search.toLowerCase());

  return matchStatus && matchEvent && matchSearch;
});
  const counts = {
    all:      registrations.length,
    approved: registrations.filter(r=>r.status==="approved").length,
    pending:  registrations.filter(r=>r.status==="pending").length,
    rejected: registrations.filter(r=>r.status==="rejected").length,
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
              <h1 className="text-3xl font-black text-slate-900">All Registrations</h1>
              <p className="text-slate-500 mt-0.5 text-sm">
                {loading ? "Loading..." : `${filtered.length} of ${registrations.length} registrations`}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-52">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"/>
                <input type="text" placeholder="Search student, event or college..."
                  value={search} onChange={e=>setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"/>
              </div>

              {/* Event filter */}
              <select value={eventFilter} onChange={e=>setEventFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400 min-w-48">
                <option value="">All Events</option>
                {events.map(ev=>(
                  <option key={ev._id} value={ev._id}>{ev.title}</option>
                ))}
              </select>
            </div>

            {/* Status pills */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {[
                {id:"all",      label:`All (${counts.all})`            },
                {id:"approved", label:`✅ Approved (${counts.approved})`},
                {id:"pending",  label:`⏳ Pending (${counts.pending})`  },
                {id:"rejected", label:`❌ Rejected (${counts.rejected})`},
              ].map(f=>(
                <button key={f.id} onClick={()=>setStatus(f.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    statusFilter===f.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i=><div key={i} className="h-20 bg-white rounded-2xl animate-pulse shadow-sm"/>)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
              <FaTicketAlt className="text-6xl text-slate-200 mx-auto mb-4"/>
              <p className="text-slate-500 font-bold text-lg">No registrations found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Table header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                <div className="col-span-3">Student</div>
                <div className="col-span-4">Event</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">College</div>
                <div className="col-span-1">Status</div>
              </div>

              <div className="divide-y divide-slate-100">
                {filtered.map(reg => {
                  const ev  = reg.event || reg.event_id || {};
                  const st  = reg.student || reg.user_id || {};
                  const cfg = STATUS_CFG[reg.status] || STATUS_CFG.pending;
                  return (
                    <div key={reg._id}
                      className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-indigo-50/30 transition-colors">
                      {/* Student */}
                      <div className="col-span-3 flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avColor(st.name)} flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}>
                          {st.name?.[0]?.toUpperCase()||"?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate">{st.name||"—"}</p>
                          <p className="text-xs text-slate-400 truncate">{st.email||"—"}</p>
                        </div>
                      </div>

                      {/* Event */}
                      <div className="col-span-4 min-w-0">
                        <p className="font-semibold text-slate-700 text-sm truncate">{ev.title||"—"}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          {ev.category && (
                            <span className="capitalize text-indigo-500 font-semibold">{ev.category}</span>
                          )}
                          {ev.location && (
                            <span className="flex items-center gap-0.5 truncate">
                              <FaMapMarkerAlt className="text-slate-300 flex-shrink-0"/> {ev.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Registered date */}
                      <div className="col-span-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-slate-300"/>
                          {new Date(reg.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                        </div>
                      </div>

                      {/* College */}
                      <div className="col-span-2 text-xs text-slate-500 truncate">
                        {st.college || ev.collegeName || "—"}
                      </div>

                      {/* Status */}
                      <div className="col-span-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.chip}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}