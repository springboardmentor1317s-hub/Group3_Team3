import { useState } from "react";
import { Link } from "react-router-dom";

function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "SRM Institute Admin",
    email: "admin@srm.edu",
    phone: "+91 98765 43210",
    college: "SRM Institute"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", profile);
    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-20">
      <div className="max-w-lg mx-auto px-6">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-3 mb-12 text-purple-600 hover:text-purple-700 font-bold text-lg">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-purple-100">
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-6 shadow-2xl flex items-center justify-center">
              <span className="text-5xl text-white font-black">A</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 transition-all shadow-sm text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">College Name</label>
              <input
                type="text"
                value={profile.college}
                onChange={(e) => setProfile({...profile, college: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 transition-all shadow-sm text-lg"
              />
            </div>

            <div className="flex gap-6 pt-8 border-t border-slate-200">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-xl"
              >
                Save Changes
              </button>
              <Link
                to="/admin/dashboard"
                className="flex-1 text-center font-bold py-5 border-2 border-slate-300 rounded-2xl hover:bg-slate-50 transition-all shadow-lg text-slate-800 text-xl"
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

export default AdminProfile;
