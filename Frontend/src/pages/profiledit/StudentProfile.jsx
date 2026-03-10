// src/pages/profile/StudentProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { getUser } from "../../services/auth";
import { 
  FaEdit, FaSave, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaGraduationCap, FaCalendarAlt, FaUser, FaCheckCircle 
} from "react-icons/fa";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    location: "",
    dob: "",
    eventsRegistered: 0
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = getUser();
        if (user?.id) {
          const res = await api.get(`/students/${user.id}`);
          setProfile(res.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
    setSaveSuccess(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSaveSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = getUser();
      await api.put(`/students/${user.id}`, profile);
      setEditMode(false);
      setSaveSuccess(true);
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify({
        ...getUser(),
        fullName: profile.fullName,
        college: profile.college
      }));
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
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
          <div className="flex items-center gap-6 mb-12">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-2xl border-4 border-white">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "S"}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                {profile.fullName || "Student Name"}
              </h1>
              <p className="text-xl text-gray-600 mt-2">{profile.degree} | {profile.college}</p>
            </div>
            {!editMode && (
              <button 
                onClick={handleEdit}
                className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all font-semibold shadow-lg flex items-center gap-2"
              >
                <FaEdit className="text-xl" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Save Success Message */}
          {saveSuccess && (
            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl shadow-lg flex items-center gap-4 animate-bounce">
              <FaCheckCircle className="text-emerald-500 text-3xl flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-emerald-800">Profile Updated!</h3>
                <p className="text-emerald-700">Your changes have been saved successfully.</p>
              </div>
            </div>
          )}

          {/* Profile Cards */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Academic Details */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <FaGraduationCap className="text-indigo-600" />
                Academic Details
              </h3>
              
              <div className="space-y-6">
                {/* Full Name */}
                <div className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg font-semibold"
                      />
                    ) : (
                      <p className="text-xl font-bold text-gray-900">{profile.fullName}</p>
                    )}
                  </div>
                </div>

                {/* Degree */}
                <div className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Degree</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="degree"
                        value={profile.degree}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{profile.degree}</p>
                    )}
                  </div>
                </div>

                {/* College */}
                <div className="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">College</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="college"
                        value={profile.college}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 text-lg"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">{profile.college}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <FaUser className="text-purple-600" />
                Contact Details
              </h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl">
                  <FaEnvelope className="text-green-500 text-xl flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                    />
                  ) : (
                    <p className="flex-1 text-lg font-semibold text-gray-900 break-all">{profile.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl">
                  <FaPhone className="text-blue-500 text-xl flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    />
                  ) : (
                    <p className="flex-1 text-lg font-semibold text-gray-900">{profile.phone}</p>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl">
                  <FaMapMarkerAlt className="text-orange-500 text-xl flex-shrink-0" />
                  {editMode ? (
                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                    />
                  ) : (
                    <p className="flex-1 text-lg font-semibold text-gray-900">{profile.location}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl">
                  <FaCalendarAlt className="text-indigo-500 text-xl flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                    {editMode ? (
                      <input
                        type="date"
                        name="dob"
                        value={profile.dob}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-gray-900">
                        {profile.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : "Not set"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Edit Mode */}
          {editMode && (
            <div className="mt-12 flex gap-4 justify-center">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-lg font-bold rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all shadow-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="text-xl" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                onClick={handleCancel}
                className="px-12 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-lg font-bold rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all shadow-lg"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Stats Footer */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl border border-blue-200/50">
              <p className="text-3xl font-black text-blue-600">{profile.eventsRegistered}</p>
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
