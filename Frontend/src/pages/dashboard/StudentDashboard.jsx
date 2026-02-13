import { Link } from "react-router-dom";

function StudentDashboard() {
  // Static data for UI (backend will replace these)
  const stats = [
    { label: "Registered Events", value: "8", subtitle: "3 upcoming, 5 completed", icon: "🎫", color: "emerald" },
    { label: "Avg Rating", value: "4.7", subtitle: "Based on 23 reviews", icon: "⭐", color: "blue" },
    { label: "Upcoming", value: "3", subtitle: "Events this week", icon: "⏰", color: "orange" },
    { label: "Certificates", value: "12", subtitle: "Events completed", icon: "🏆", color: "purple" }
  ];

  const recentEvents = [
    { title: "Inter-College Hackathon 2026", college: "SRM Institute", date: "Feb 20-22", status: "Upcoming", participants: "127/200" },
    { title: "Cultural Fest - Rhythm 2026", college: "VIT Vellore", date: "Mar 5", status: "Approved", participants: "89/150" },
    { title: "Sports Championship", college: "Anna University", date: "Feb 15", status: "Completed", participants: "245" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="font-bold text-xl text-slate-900">Sowmiya R</h2>
              <p className="text-sm text-slate-500">Student - SRM Institute</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/events" className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all">
              All Events
            </Link>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:brightness-105 transition-all text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards - Backend will update numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100/50 group hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 bg-${stat.color}-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className={`text-${stat.color}-600 text-2xl font-bold`}>{stat.icon}</span>
                </div>
                <div className="text-right">
                  <p className="text-slate-600 text-sm font-medium opacity-80">{stat.label}</p>
                  <p className="text-4xl font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            {/* Quick Actions */}
<div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100/50">
  <h3 className="text-2xl font-bold text-slate-900 mb-8">Quick Actions</h3>
  <div className="space-y-4">
    {/* Browse Events */}
    <Link to="/events" className="group block p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🏃</span>
        <span className="font-bold text-indigo-700 group-hover:text-indigo-800">Browse All Events</span>
      </div>
      <p className="text-sm text-indigo-600">Discover new events</p>
    </Link>
    
    {/* My Registrations */}
    <Link to="/registered" className="group block p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">📋</span>
        <span className="font-bold text-emerald-700 group-hover:text-emerald-800">My Registrations</span>
      </div>
      <p className="text-sm text-emerald-600">Track your events</p>
    </Link>
    
    {/* NEW: Completed & Missed Events (replaces Certificates) */}
    <Link to="/completed-events" className="group block p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">✅</span>
        <span className="font-bold text-emerald-700 group-hover:text-emerald-800">Completed Events</span>
      </div>
      <p className="text-sm text-emerald-600">View history & ratings</p>
    </Link>
  </div>
</div>


            {/* Next Event - Backend will populate */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-8 shadow-2xl border-0">
              <h4 className="font-bold text-xl mb-4">Next Event</h4>
              <div className="space-y-2 mb-6">
                <h5 className="font-bold text-lg">Sports Fest 2026</h5>
                <p className="opacity-90 text-sm">Feb 15, 2026</p>
                <p className="opacity-80 text-xs">SRM Campus, Chennai</p>
              </div>
              <Link to="/event-details" className="w-full block bg-white/20 backdrop-blur-sm rounded-2xl py-3 px-6 text-center font-semibold hover:bg-white/30 transition-all duration-300">
                View Details →
              </Link>
            </div>
          </div>

          {/* Recent Events */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-slate-900">Recent Events</h3>
              <Link to="/events" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:brightness-105 transition-all text-sm">
                View All Events →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const getStatusStyle = (status) => {
    switch(status) {
      case "Upcoming": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Approved": return "bg-blue-100 text-blue-800 border-blue-200"; 
      case "Completed": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden border border-slate-100 hover:border-purple-200">
      {/* Status Badge */}
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 mb-6 ${getStatusStyle(event.status)}`}>
        {event.status}
      </div>
      
      <h4 className="font-black text-xl text-slate-900 mb-4 leading-tight group-hover:text-purple-700 transition-colors">
        {event.title}
      </h4>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="text-lg">🏫</span>
          <span className="font-semibold">{event.college}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <span className="text-lg">📅</span>
          <span className="font-semibold">{event.date}</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full shadow-inner" style={{width: '75%'}}></div>
      </div>
      
      <p className="text-lg font-bold text-slate-900 mb-6">{event.participants}</p>
      
      <div className="flex gap-3">
        <Link 
          to="/event-details" 
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl text-center shadow-lg hover:shadow-xl hover:brightness-105 transition-all duration-300"
        >
          View Details
        </Link>
        <button className="px-6 py-3 font-semibold text-slate-700 border-2 border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-md">
          Rate
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;
