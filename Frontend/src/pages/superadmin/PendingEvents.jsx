import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { FaCircleCheck, FaCircleXmark, FaEye, FaCalendarDays, FaMapLocationDot } from "react-icons/fa6";

function PendingEvents() {
  const [pendingEvents, setPendingEvents] = useState([
    {
      id: 1,
      title: "TechFest 2026",
      college: "Madurai Kamaraj University",
      date: "Mar 15-17, 2026",
      location: "MKU Campus, Madurai",
      attendees: 1200,
      tickets: "₹199-₹999",
      organizer: "Tech Club MKU",
      status: "pending",
      appliedDate: "Feb 24, 2026"
    },
    {
      id: 2,
      title: "Cultural Night 2026",
      college: "Thiagarajar College of Engineering",
      date: "Mar 10, 2026",
      location: "TCE Auditorium",
      attendees: 850,
      tickets: "₹99-₹499",
      organizer: "Cultural Committee",
      status: "pending",
      appliedDate: "Feb 23, 2026"
    },
    {
      id: 3,
      title: "Sports Fest 2026",
      college: "St. Joseph's College",
      date: "Mar 20-22, 2026",
      location: "SJC Sports Ground",
      attendees: 650,
      tickets: "₹50-₹299",
      organizer: "Sports Council",
      status: "pending",
      appliedDate: "Feb 25, 2026"
    }
  ]);

  const approveEvent = (id) => {
    setPendingEvents(prev => prev.filter(e => e.id !== id));
  };

  const rejectEvent = (id) => {
    setPendingEvents(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'rejected' } : e
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Pending Events</h1>
            <p className="text-xl text-slate-600">Review new event requests (12 pending)</p>
          </div>
          <Link to="/super-admin/colleges" className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl">
            View All Colleges →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3 text-purple-500">⏳</div>
            <div className="text-3xl font-black text-purple-700">12</div>
            <p className="text-slate-600 font-semibold">Pending Events</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3 text-emerald-500">✅</div>
            <div className="text-3xl font-black text-emerald-700">156</div>
            <p className="text-slate-600 font-semibold">Approved Events</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3 text-orange-500">📊</div>
            <div className="text-3xl font-black text-orange-700">2.3K</div>
            <p className="text-slate-600 font-semibold">Total Attendees</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="text-4xl mb-3 text-indigo-500">💰</div>
            <div className="text-3xl font-black text-indigo-700">₹8.2L</div>
            <p className="text-slate-600 font-semibold">Total Revenue</p>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">Event Approval Queue</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-100">
                  <th className="p-6 text-left font-bold text-slate-800 text-lg">Event Details</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">College</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">Date</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">Attendees</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">Tickets</th>
                  <th className="p-6 text-center font-bold text-slate-800 text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingEvents.map((event) => (
                  <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-6">
                      <div>
                        <div className="font-bold text-xl text-slate-900 mb-1">{event.title}</div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                          <FaMapPin className="text-xs" />
                          <span>{event.location}</span>
                        </div>
                        <div className="text-xs text-slate-500">Applied: {event.appliedDate}</div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="font-semibold text-indigo-700">{event.college}</div>
                      <div className="text-sm text-slate-500">{event.organizer}</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="font-bold text-2xl text-emerald-600">{event.date}</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="font-bold text-xl text-purple-600">{event.attendees.toLocaleString()}</div>
                    </td>
                    <td className="p-6 text-center font-bold text-lg text-amber-600">{event.tickets}</td>
                    <td className="p-6 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => approveEvent(event.id)}
                          className="p-3 text-emerald-600 hover:bg-emerald-100 rounded-2xl transition-all shadow-md hover:shadow-lg"
                          title="Approve Event"
                        >
                          <FaCheckCircle className="text-xl" />
                        </button>
                        <button
                          onClick={() => rejectEvent(event.id)}
                          className="p-3 text-red-600 hover:bg-red-100 rounded-2xl transition-all shadow-md hover:shadow-lg"
                          title="Reject Event"
                        >
                          <FaTimesCircle className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {pendingEvents.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-4xl text-emerald-600" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">No pending events!</h3>
            <p className="text-xl text-slate-600 mb-8">All events approved and live</p>
            <Link to="/super-admin/colleges" className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold">
              View All Colleges
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingEvents;
