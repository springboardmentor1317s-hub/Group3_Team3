// src/pages/student/RegisterEvents.jsx
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { FaSearch, FaPlus, FaCalendarAlt, FaUsers } from "react-icons/fa";

const RegisterEvents = () => {
  const [events] = useState([
    { id: 1, title: "TCY Tech Fest 2025", college: "TCY Engineering", date: "Mar 15", spots: 50, status: "open" },
    { id: 2, title: "VTU Cultural Night", college: "VTU College", date: "Mar 20", spots: 100, status: "open" },
    { id: 3, title: "MGR Hackathon", college: "MGR University", date: "Apr 01", spots: 25, status: "open" }
  ]);

  const handleRegister = (eventId) => {
    alert(`Registered for ${events.find(e => e.id === eventId).title}!`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FaPlus className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900">Register for Events</h1>
            <p className="text-xl text-gray-600 mt-2">Find and register for college events</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100 overflow-hidden group">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    event.status === 'open' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaUsers /> {event.spots} spots
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-all">{event.title}</h3>
                <p className="text-gray-600 mb-6">{event.college}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                  <FaCalendarAlt />
                  {event.date}
                </div>
                
                <button
                  onClick={() => handleRegister(event.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all group-hover:bg-blue-600"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RegisterEvents;
