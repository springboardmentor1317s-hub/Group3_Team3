import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

function ManageRegistrations() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);

  const fetchRegs = async () => {
    try {
      const res = await api.get(`/registrations/event/${eventId}`);
      setRegistrations(res.data);
    } catch {
      toast.error("Failed to load registrations");
    }
  };

  useEffect(() => {
    fetchRegs();
  }, [eventId]);

  const handleStatus = async (id, status) => {
    try {
      await api.put("/registrations/manage", { registrationId: id, status });
      toast.success(`Marked as ${status}`);
      fetchRegs();
    } catch {
      toast.error("Failed to update status");
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
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
          styles[status] ?? "bg-gray-100 text-gray-700 border border-gray-200"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Registrations</h1>
          </div>
          <p className="text-sm text-gray-500 ml-12">
            {registrations.length} registration{registrations.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Content */}
        {registrations.length === 0 ? (
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
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                      User
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                      Email
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                      College
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {registrations.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-600 font-semibold text-xs">
                              {r.user_id.fullName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{r.user_id.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{r.user_id.email}</td>
                      <td className="px-6 py-4 text-gray-600">{r.user_id.college}</td>
                      <td className="px-6 py-4">{statusBadge(r.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatus(r._id, "approved")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors duration-150"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatus(r._id, "rejected")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors duration-150"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
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
  );
}

export default ManageRegistrations;