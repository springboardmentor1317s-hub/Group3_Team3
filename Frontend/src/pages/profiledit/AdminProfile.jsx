import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser, setUser } from "../../services/auth";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaSave,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-toastify";

function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    location: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: loads real data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        const u = res.data.user || res.data;
        setProfile({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          college: u.college || "",
          location: u.location || "",
        });
      } catch (err) {
        // fallback to localStorage
        const u = getUser();
        if (u) {
          setProfile({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            college: u.college || "",
            location: u.location || "",
          });
        }
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ FIXED: saves real data to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/users/profile", profile);
      const updatedUser = res.data.user || res.data;
      const current = getUser();
      const merged = {
        ...current,
        ...updatedUser,
        name: profile.name,
        college: profile.college,
      };
      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));

      setEditMode(false);
      toast.success("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 outline-none transition-all shadow-sm text-lg bg-white disabled:bg-slate-50 disabled:text-slate-500";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12">
        <div className="max-w-lg mx-auto px-6">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 mb-10 text-purple-600 hover:text-purple-700 font-bold"
          >
            ← Back to Dashboard
          </Link>

          <div className="bg-white rounded-3xl p-10 shadow-2xl border border-purple-100">
            {/* Avatar */}
            <div className="text-center mb-10">
              <div className="w-28 h-28 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mx-auto mb-4 shadow-2xl flex items-center justify-center">
                <span className="text-5xl text-white font-black">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900">
                {profile.name || "Admin"}
              </h1>
              <p className="text-slate-500 mt-1">
                {profile.college || "College Admin"}
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-purple-500" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={inputClass}
                />
              </div>

              {/* Email - always readonly */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-purple-500" /> Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <FaPhone className="text-purple-500" /> Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FaGraduationCap className="text-purple-500" /> College Name
                </label>
                <input
                  type="text"
                  name="college"
                  value={profile.college}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={inputClass}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                {editMode ? (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-lg disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex-1 font-bold py-4 border-2 border-slate-300 rounded-2xl hover:bg-slate-50 transition-all text-slate-700 text-lg"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all text-lg"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminProfile;
