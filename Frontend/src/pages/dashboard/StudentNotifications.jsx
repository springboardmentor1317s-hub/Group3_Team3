// src/pages/dashboard/StudentNotifications.jsx
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { FaBell, FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Mock API call - replace with your actual endpoint
        const mockNotifications = [
          { 
            id: 1, 
            message: "🎉 TCY Tech Fest 2025 registration APPROVED!", 
            type: "success", 
            time: "2h ago",
            eventId: "123"
          },
          { 
            id: 2, 
            message: "⏳ VTU Cultural Night - Pending college approval", 
            type: "pending", 
            time: "1d ago",
            eventId: "456"
          },
          { 
            id: 3, 
            message: "❌ PERUMAL Sports Meet registration REJECTED", 
            type: "rejected", 
            time: "3d ago",
            eventId: "789"
          },
          { 
            id: 4, 
            message: "✅ MGR Hackathon registration CONFIRMED!", 
            type: "success", 
            time: "5d ago",
            eventId: "101"
          }
        ];
        setNotifications(mockNotifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaBell className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Notifications</h1>
              <p className="text-xl text-gray-600 mt-1">Stay updated with your registration status</p>
            </div>
          </div>

          {/* Notification Badge */}
          <div className="mb-8 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-200/50 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-emerald-800">You have {notifications.length} new notifications</span>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group p-6 rounded-3xl shadow-xl border transition-all hover:shadow-2xl hover:-translate-y-1 ${
                  notification.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : notification.type === 'pending'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  {notification.type === 'success' && (
                    <FaCheckCircle className="text-emerald-500 text-3xl mt-1 flex-shrink-0" />
                  )}
                  {notification.type === 'pending' && (
                    <FaClock className="text-amber-500 text-3xl mt-1 flex-shrink-0" />
                  )}
                  {notification.type === 'rejected' && (
                    <FaTimesCircle className="text-red-500 text-3xl mt-1 flex-shrink-0" />
                  )}

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                      <span>{notification.time}</span>
                      <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                      <span className="text-indigo-600 hover:text-indigo-700 group-hover:translate-x-1 transition-all">
                        View Event →
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Notifications */}
          {notifications.length === 0 && !loading && (
            <div className="text-center py-20 text-gray-400">
              <FaBell className="text-6xl mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-600">No notifications</h3>
              <p className="text-lg">You'll see updates here when you register for events</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentNotifications;
