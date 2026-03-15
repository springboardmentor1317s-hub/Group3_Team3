// src/pages/profiledit/StudentProfile.jsx
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser, setUser } from "../../services/auth";
import {
  FaEdit,
  FaSave,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

const StudentProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [regCount, setRegCount] = useState(0);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    location: "",
    dob: "",
  });

  // ✅ FIXED: was GET /students/:id → correct endpoint is GET /users/profile
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
          degree: u.degree || "",
          location: u.location || "",
          dob: u.dob ? u.dob.split("T")[0] : "",
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
            degree: u.degree || "",
            location: u.location || "",
            dob: "",
          });
        }
        console.error("Error fetching profile:", err);
      }
    };

    const fetchRegCount = async () => {
      try {
        const res = await api.get("/registrations/my");
        setRegCount((res.data.registrations || []).length);
      } catch (_) {}
    };

    fetchProfile();
    fetchRegCount();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ FIXED: was PUT /students/:id → correct endpoint is PUT /users/profile
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put("/users/profile", profile);
      const updatedUser = res.data.user || res.data;

      // Update localStorage
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
      setSaveSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-6 mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl border-4 border-white">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-black text-slate-900">
                {profile.name || "Student Name"}
              </h1>
              <p className="text-gray-500 mt-1">
                {profile.degree || "Degree"} • {profile.college || "College"}
              </p>
            </div>
            {!editMode && (
              <button
                onClick={() => {
                  setEditMode(true);
                  setSaveSuccess(false);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center gap-4">
              <FaCheckCircle className="text-emerald-500 text-2xl flex-shrink-0" />
              <p className="font-bold text-emerald-800">
                Profile updated successfully!
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Academic Details */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <FaGraduationCap className="text-indigo-600" /> Academic Details
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Full Name", name: "name", type: "text" },
                  { label: "Degree / Course", name: "degree", type: "text" },
                  { label: "College", name: "college", type: "text" },
                ].map((field) => (
                  <div
                    key={field.name}
                    className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl"
                  >
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      {field.label}
                    </label>
                    {editMode ? (
                      <input
                        type={field.type}
                        name={field.name}
                        value={profile[field.name]}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                      />
                    ) : (
                      <p className="font-bold text-gray-900">
                        {profile[field.name] || "—"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <FaUser className="text-purple-600" /> Contact Details
              </h3>
              <div className="space-y-4">
                {/* Email - readonly */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl">
                  <FaEnvelope className="text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Email
                    </label>
                    <p className="font-bold text-gray-900 break-all">
                      {profile.email || "—"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl">
                  <FaPhone className="text-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Phone
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                    ) : (
                      <p className="font-bold text-gray-900">
                        {profile.phone || "—"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl">
                  <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Location
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none"
                      />
                    ) : (
                      <p className="font-bold text-gray-900">
                        {profile.location || "—"}
                      </p>
                    )}
                  </div>
                </div>

                {/* DOB */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl">
                  <FaCalendarAlt className="text-indigo-500 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Date of Birth
                    </label>
                    {editMode ? (
                      <input
                        type="date"
                        name="dob"
                        value={profile.dob}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                    ) : (
                      <p className="font-bold text-gray-900">
                        {profile.dob
                          ? new Date(profile.dob).toLocaleDateString("en-IN")
                          : "—"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save / Cancel buttons */}
          {editMode && (
            <div className="mt-10 flex gap-4 justify-center">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-lg font-bold rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all shadow-lg flex items-center gap-3 disabled:opacity-50"
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
                onClick={() => setEditMode(false)}
                className="px-10 py-4 bg-gray-500 text-white text-lg font-bold rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all shadow-lg"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Stats Footer */}
          <div className="mt-10 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl border border-blue-200/50">
              <p className="text-3xl font-black text-blue-600">{regCount}</p>
              <p className="text-blue-700 font-semibold">Events Registered</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl border border-emerald-200/50">
              <p className="text-3xl font-black text-emerald-600">Active</p>
              <p className="text-emerald-700 font-semibold">Account Status</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl border border-purple-200/50">
              <p className="text-3xl font-black text-purple-600">Verified</p>
              <p className="text-purple-700 font-semibold">Email Status</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;