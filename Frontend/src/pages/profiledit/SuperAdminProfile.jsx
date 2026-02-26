import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SuperAdminProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Platform Super Admin",
    email: "super@eventhub.com",
    phone: "+91 98765 43210",
    college: "CampusEventHub Platform",
    role: "Platform Owner"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Super Admin profile updated:", formData);
    alert("✅ Profile updated successfully!");
    navigate("/super-admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-20 px-6">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <Link 
          to="/super-admin/dashboard" 
          className="inline-flex items-center gap-3 mb-12 text-indigo-600 hover:text-indigo-700 font-bold text-lg transition-colors"
        >
          ← Back to Dashboard
        </Link>
        
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-indigo-100/50">
          {/* Avatar */}
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 shadow-2xl flex items-center justify-center border-4 border-white">
              <span className="text-5xl text-white font-black">SA</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Edit Profile</h1>
            <p className="text-xl text-slate-600">Update your super admin details</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/50 transition-all shadow-sm text-lg"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/50 transition-all shadow-sm"
                  placeholder="super@eventhub.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/50 transition-all shadow-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* College/Platform */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Platform/College</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/50 transition-all shadow-sm text-lg"
                placeholder="CampusEventHub Platform"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Role/Position</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/50 transition-all shadow-sm text-lg"
                placeholder="Platform Owner"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 pt-8 border-t border-slate-200">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-xl"
              >
                💾 Save Changes
              </button>
              <Link
                to="/super-admin/dashboard"
                className="flex-1 flex items-center justify-center font-bold py-5 px-8 border-2 border-slate-300 rounded-2xl hover:bg-slate-50 hover:shadow-lg transition-all text-slate-800 text-xl"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminProfile;