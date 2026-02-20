import { Link } from "react-router-dom";
import Chatbot from '../components/Chatbot';

function StudentDashboard() {
  // Static data for UI (backend will replace these)
  const stats = [
    { 
      label: "Registered Events", 
      value: "8", 
      subtitle: "3 upcoming, 5 completed", 
      icon: "🎫", 
      color: "emerald" 
    },
    { 
      label: "Avg Rating", 
      value: "4.7", 
      subtitle: "Based on 23 reviews", 
      icon: "⭐", 
      color: "blue" 
    },
    { 
      label: "Upcoming", 
      value: "3", 
      subtitle: "Events this week", 
      icon: "⏰", 
      color: "orange" 
    },
    { 
      label: "Certificates", 
      value: "12", 
      subtitle: "Events completed", 
      icon: "🏆", 
      color: "purple" 
    }
  ];

  const recentEvents = [
    { 
      title: "Inter-College Hackathon 2026", 
      college: "SRM Institute", 
      date: "Feb 20-22", 
      status: "Upcoming", 
      participants: "127/200" 
    },
    { 
      title: "Cultural Fest - Rhythm 2026", 
      college: "VIT Vellore", 
      date: "Mar 5", 
      status: "Approved", 
      participants: "89/150" 
    },
    { 
      title: "Sports Championship", 
      college: "Anna University", 
      date: "Feb 15", 
      status: "Completed", 
      participants: "245" 
    }
  ];

  const getStatColorClasses = (color) => {
    const colors = {
      emerald: "from-emerald-500 to-emerald-600",
      blue: "from-blue-500 to-blue-600",
      orange: "from-orange-500 to-orange-600",
      purple: "from-purple-500 to-purple-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="mt-2 text-base text-slate-600">Welcome back! Here's your event overview</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className={`h-3 bg-linear-to-r ${getStatColorClasses(stat.color)} rounded-t-2xl`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{stat.icon}</span>
                  <span className={`text-4xl font-bold bg-linear-to-r ${getStatColorClasses(stat.color)} bg-clip-text text-transparent`}>
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{stat.label}</h3>
                <p className="text-sm text-slate-500">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Recent Events */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Events Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Recent Events</h2>
                <Link 
                  to="/events" 
                  className="text-base font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  View All Events →
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentEvents.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            </div>
          </div>
          <Chatbot />

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                {/* Browse Events */}
                <Link 
                  to="/events" 
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 group"
                >
                  <span className="text-3xl">🏃</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 group-hover:text-purple-700 mb-0.5">Browse All Events</div>
                    <div className="text-sm text-slate-500">Discover new events</div>
                  </div>
                </Link>

                {/* My Registrations */}
                <Link 
                  to="/my-registrations" 
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 group"
                >
                  <span className="text-3xl">📋</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 group-hover:text-purple-700 mb-0.5">My Registrations</div>
                    <div className="text-sm text-slate-500">Track your events</div>
                  </div>
                </Link>

                {/* Completed Events */}
                <Link 
                  to="/completed-events" 
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 group"
                >
                  <span className="text-3xl">✅</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 group-hover:text-purple-700 mb-0.5">Completed Events</div>
                    <div className="text-sm text-slate-500">View history & ratings</div>
                  </div>
                </Link>
              </div>
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
      case "Upcoming":
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case "Approved":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Completed":
        return "bg-slate-100 text-slate-700 border-slate-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getProgressColor = (status) => {
    switch(status) {
      case "Upcoming":
        return "bg-emerald-500";
      case "Approved":
        return "bg-blue-500";
      case "Completed":
        return "bg-slate-400";
      default:
        return "bg-gray-500";
    }
  };

  const calculateProgress = () => {
    if (!event.participants.includes('/')) return 100;
    const [current, total] = event.participants.split('/').map(Number);
    return (current / total) * 100;
  };

  return (
    <div className="p-8 hover:bg-slate-50/50 transition-colors duration-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(event.status)}`}>
              {event.status}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-base text-slate-600">
              <span>🏫</span>
              <span>{event.college}</span>
            </div>
            <div className="flex items-center gap-2 text-base text-slate-600">
              <span>📅</span>
              <span>{event.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {event.participants.includes('/') && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-600">Registration Progress</span>
            <span className="text-sm font-bold text-slate-900">{event.participants}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full ${getProgressColor(event.status)} rounded-full transition-all duration-300`}
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Link 
          to="/event-details" 
          className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-200 shadow-sm"
        >
          View Details
        </Link>
        {event.status === "Completed" && (
          <Link 
            to="/rate-event" 
            className="flex-1 text-center bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3.5 px-6 rounded-xl transition-colors duration-200"
          >
            Rate
          </Link>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
