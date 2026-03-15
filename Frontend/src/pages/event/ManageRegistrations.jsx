// src/pages/event/ManageRegistrations.jsx - WITH EXPORT ✅
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import * as XLSX from 'xlsx'; // ✅ NEW: Excel library
import { FaFileExcel, FaDownload } from 'react-icons/fa'; // ✅ NEW: Icons

function ManageRegistrations() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  // ✅ NEW: EXPORT TO EXCEL FUNCTION
  const exportToExcel = () => {
    // Format data for Excel
    const excelData = registrations.map(reg => ({
      Name: reg.user_id?.name || 'Unknown',
      Email: reg.user_id?.email || '—',
      College: reg.user_id?.college || '—',
      Phone: reg.phone || '—',
      Status: reg.status?.toUpperCase() || 'PENDING',
      Registered: new Date(reg.timestamp || reg.createdAt).toLocaleDateString('en-IN'),
      '_id': reg._id // Internal ID
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    
    const fileName = `Event_Registrations_${eventId}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    showToast('Excel exported successfully!', 'success');
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRegs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/registrations/event/${eventId}`);
      setRegistrations(res.data.registrations || []);
    } catch {
      showToast("Failed to load registrations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegs();
  }, [eventId]);

  const handleStatus = async (id, status) => {
    try {
      setActionLoading(id);
      await api.put(`/registrations/${id}/status`, { status });
      showToast(`Registration ${status} successfully`);
      fetchRegs();
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      rejected: "bg-red-100 text-red-700 border border-red-200",
      pending: "bg-amber-100 text-amber-700 border border-amber-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? "bg-gray-100 text-gray-700 border border-gray-200"}`}
      >
        {status === "approved" ? "✅ " : status === "rejected" ? "❌ " : "⏳ "}
        {status}
      </span>
    );
  };

  const counts = registrations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Navbar />

      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-2xl shadow-2xl font-bold text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}
        >
          {toast.msg}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* ✅ UPDATED HEADER WITH EXPORT BUTTON */}
          <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Link
                  to="/admin/dashboard/events"
                  className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm"
                >
                  ←
                </Link>
                <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Registrations</h1>
              </div>
              <p className="text-sm text-gray-500 ml-12">
                {registrations.length} registration{registrations.length !== 1 ? "s" : ""} total
              </p>
            </div>

            {/* ✅ SUMMARY + EXPORT BUTTONS */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Summary badges */}
              <div className="flex gap-3 flex-wrap">
                <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                  ⏳ Pending: {counts.pending || 0}
                </span>
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  ✅ Approved: {counts.approved || 0}
                </span>
                <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                  ❌ Rejected: {counts.rejected || 0}
                </span>
              </div>
              
              {/* ✅ NEW EXPORT BUTTON */}
              <button
                onClick={exportToExcel}
                disabled={loading || registrations.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <FaFileExcel className="text-sm" />
                Export Excel ({registrations.length})
              </button>
            </div>
          </div>

          {/* Rest of your existing content... */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No registrations yet</p>
              <p className="text-sm text-gray-400 mt-1">Check back once participants sign up.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  {/* Your existing table code - NO CHANGE */}
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Student</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Email</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">College</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Registered</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registrations.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-indigo-600 font-semibold text-xs">
                                {r.user_id?.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{r.user_id?.name || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{r.user_id?.email || "—"}</td>
                        <td className="px-6 py-4 text-gray-600">{r.user_id?.college || "—"}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {new Date(r.timestamp || r.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-6 py-4">{statusBadge(r.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {r.status !== "approved" && (
                              <button
                                onClick={() => handleStatus(r._id, "approved")}
                                disabled={actionLoading === r._id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors duration-150 disabled:opacity-50"
                              >
                                {actionLoading === r._id ? (
                                  <span className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                Approve
                              </button>
                            )}
                            {r.status !== "rejected" && (
                              <button
                                onClick={() => handleStatus(r._id, "rejected")}
                                disabled={actionLoading === r._id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors duration-150 disabled:opacity-50"
                              >
                                {actionLoading === r._id ? (
                                  <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                                Reject
                              </button>
                            )}
                            {r.status !== "pending" && (
                              <button
                                onClick={() => handleStatus(r._id, "pending")}
                                disabled={actionLoading === r._id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors duration-150 disabled:opacity-50"
                              >
                                Reset
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
          )}
        </div>
      </div>
    </>
  );
}

export default ManageRegistrations;
