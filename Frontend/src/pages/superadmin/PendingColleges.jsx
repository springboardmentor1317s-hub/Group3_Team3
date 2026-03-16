// src/pages/superadmin/PendingColleges.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { FaCircleCheck, FaCircleXmark, FaCalendarDays } from "react-icons/fa6";
import { FaGraduationCap, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";

function PendingColleges() {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pending colleges = college_admin users who registered but aren't verified yet
  // We fetch all college_admin users and show them here for super admin review
  const fetchPendingAdmins = async () => {
    try {
      const res = await api.get("/users");
      const users = res.data.users || res.data || [];
      // Show college_admin users as "pending" colleges needing review
      const admins = users.filter((u) => u.role === "college_admin");
      setPendingAdmins(admins);
    } catch (err) {
      console.error("Failed to load pending colleges", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const approveAdmin = async (id) => {
    try {
      // Mark the admin as active/approved — update their profile
      await api.put(`/users/${id}`, { status: "active" });
      toast.success("✅ College approved!");
      fetchPendingAdmins();
    } catch (err) {
      toast.error("Failed to approve college");
    }
  };

  const rejectAdmin = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success("College admin removed.");
      fetchPendingAdmins();
    } catch (err) {
      toast.error("Failed to reject college");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-1">
              Pending Colleges
            </h1>
            <p className="text-slate-500">
              College admins registered and awaiting review
            </p>
          </div>
          <Link
            to="/super-admin/colleges"
            className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            ← All Colleges
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-3xl shadow animate-pulse"
              />
            ))}
          </div>
        ) : pendingAdmins.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <FaCircleCheck className="text-7xl mx-auto mb-4 opacity-20" />
            <h3 className="text-2xl font-bold mb-2">No pending colleges</h3>
            <p>All colleges have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-5">
            {pendingAdmins.map((admin) => (
              <div
                key={admin._id}
                className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                      {admin.college?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {admin.college}
                      </h3>
                      <p className="text-slate-600 flex items-center gap-2 text-sm mt-1">
                        <FaGraduationCap className="text-indigo-500" />{" "}
                        {admin.name}
                      </p>
                      <p className="text-slate-500 flex items-center gap-2 text-sm">
                        <FaEnvelope className="text-pink-500" /> {admin.email}
                      </p>
                      <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                        <FaCalendarDays /> Joined{" "}
                        {new Date(admin.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => approveAdmin(admin._id)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <FaCircleCheck /> Approve
                    </button>
                    <button
                      onClick={() => rejectAdmin(admin._id)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      <FaCircleXmark /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingColleges;