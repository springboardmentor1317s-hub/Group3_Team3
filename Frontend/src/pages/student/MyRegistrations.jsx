// src/pages/student/MyRegistrations.jsx
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { FaCalendarCheck, FaCheckCircle, FaClock, FaTimes } from "react-icons/fa";

const MyRegistrations = () => {
  const [registrations] = useState([
    { id: 1, event: "TCY Tech Fest", college: "TCY Engineering", status: "approved", date: "Mar 15" },
    { id: 2, event: "VTU Cultural Night", college: "VTU College", status: "pending", date: "Mar 20" },
    { id: 3, event: "PERUMAL Sports", college: "Perumal College", status: "rejected", date: "Mar 25" }
  ]);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FaCalendarCheck className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900">My Registrations</h1>
            <p className="text-xl text-gray-600 mt-2">Track your event registrations</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="p-6 text-left font-bold text-gray-900">Event</th>
                  <th className="p-6 text-left font-bold text-gray-900">College</th>
                  <th className="p-6 text-left font-bold text-gray-900">Status</th>
                  <th className="p-6 text-left font-bold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-gray-50 transition-all">
                    <td className="p-6 font-semibold text-gray-900">{reg.event}</td>
                    <td className="p-6 text-gray-600">{reg.college}</td>
                    <td className="p-6">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                        reg.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        reg.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reg.status === 'approved' && <FaCheckCircle />}
                        {reg.status === 'pending' && <FaClock />}
                        {reg.status === 'rejected' && <FaTimes />}
                        {reg.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-6 text-gray-600">{reg.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRegistrations;
