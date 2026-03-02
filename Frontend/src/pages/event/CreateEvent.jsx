import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaUsers,
  FaSave,
  FaImage,
  FaTimes,
} from "react-icons/fa";

const CATEGORIES = [
  "sports",
  "hackathon",
  "cultural",
  "workshop",
  "seminar",
  "social",
  "technical",
  "other",
];
const EVENT_TYPES = ["offline", "online", "hybrid"];
const CATEGORY_EMOJI = {
  hackathon: "💻",
  cultural: "🎭",
  sports: "🏆",
  workshop: "🔧",
  seminar: "🎓",
  social: "🎉",
  technical: "⚙️",
  other: "📅",
};

function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
    event_type: "offline",
    location: "",
    venue: "",
    start_date: "",
    end_date: "",
    registration_end: "",
    max_participants: 100,
    registration_fee: 0,
    eligibility: "Open to all college students",
    requirements: "",
    tags: "",
    status: "published",
    certificates: false,
    is_featured: false,
    rules_and_regulations: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "tags") {
          const arr = value
            ? value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [];
          arr.forEach((tag) => formData.append("tags[]", tag));
        } else {
          formData.append(key, value);
        }
      });
      if (imageFile) formData.append("image", imageFile);

<<<<<<< HEAD
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please log in again.");
        navigate("/login");
        return;
      }

      const response = await api.post("/events/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("🎉 Event created successfully!");
      } else {
        toast.warning("Event created, but unexpected response received.");
      }

      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.accountType === "Super Admin") {
        navigate("/super-admin/dashboard");
      } else if (user?.accountType === "College Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("❌ Error creating event:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message || "Server error while creating event",
        );
      } else if (error.request) {
        toast.error(
          "No response from server. Please check your internet connection.",
        );
      } else {
        toast.error("Unexpected error occurred while creating the event.");
      }
=======
      await api.post("/events/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Event created successfully! 🎉");
      navigate("/admin/dashboard/events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
>>>>>>> ea643e9 (feat: student dashboard filter - added completed status + all events filter)
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/admin/dashboard"
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              <FaArrowLeft className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-800">
                Create New Event
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Fill in the details to publish your event
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* IMAGE UPLOAD */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <FaImage className="text-indigo-500" /> Event Banner Image
                </h2>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-56 object-cover rounded-xl border-2 border-indigo-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-lg"
                    >
                      <FaTimes />
                    </button>
                    <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                      <FaImage className="text-indigo-400" />
                      {imageFile?.name} ({(imageFile?.size / 1024).toFixed(0)}{" "}
                      KB)
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-indigo-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-500 text-2xl mb-3 group-hover:bg-indigo-200 transition">
                      <FaImage />
                    </div>
                    <p className="font-semibold text-slate-700">
                      Click to upload event banner
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      JPG, PNG, WebP or GIF · Max 5MB
                    </p>
                    <p className="text-xs text-indigo-500 mt-2 font-medium">
                      Recommended: 1200 × 500 px
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* BASIC INFO */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-500" /> Basic
                  Information
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Event Title *</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Inter-College Hackathon 2025"
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Description *</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Describe your event..."
                      className={inputClass + " resize-none"}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Category *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {CATEGORY_EMOJI[c]}{" "}
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Event Type *</label>
                    <select
                      name="event_type"
                      value={form.event_type}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-indigo-500" /> Location
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>City / Area *</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Mumbai, Maharashtra"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Venue Name</label>
                    <input
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      placeholder="e.g. City Cultural Center"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* DATES */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-500" /> Dates & Schedule
                </h2>
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClass}>Start Date & Time *</label>
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={form.start_date}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Date & Time *</label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={form.end_date}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Registration Deadline *
                    </label>
                    <input
                      type="datetime-local"
                      name="registration_end"
                      value={form.registration_end}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* PARTICIPANTS */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <FaUsers className="text-indigo-500" /> Participants & Fees
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Max Participants</label>
                    <input
                      type="number"
                      name="max_participants"
                      value={form.max_participants}
                      onChange={handleChange}
                      min={1}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Registration Fee (₹)</label>
                    <input
                      type="number"
                      name="registration_fee"
                      value={form.registration_fee}
                      onChange={handleChange}
                      min={0}
                      className={inputClass}
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Set 0 for free events
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Eligibility</label>
                    <input
                      name="eligibility"
                      value={form.eligibility}
                      onChange={handleChange}
                      placeholder="Who can participate?"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* ADDITIONAL */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <FaTag className="text-indigo-500" /> Additional Details
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Tags (comma separated)</label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="e.g. coding, innovation, prizes"
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Requirements</label>
                    <textarea
                      name="requirements"
                      value={form.requirements}
                      onChange={handleChange}
                      rows={2}
                      className={inputClass + " resize-none"}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Rules & Regulations</label>
                    <textarea
                      name="rules_and_regulations"
                      value={form.rules_and_regulations}
                      onChange={handleChange}
                      rows={3}
                      className={inputClass + " resize-none"}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="certificates"
                      name="certificates"
                      checked={form.certificates}
                      onChange={handleChange}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <label
                      htmlFor="certificates"
                      className="text-sm font-medium text-slate-700 cursor-pointer"
                    >
                      Issue Certificates to participants
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleChange}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <label
                      htmlFor="is_featured"
                      className="text-sm font-medium text-slate-700 cursor-pointer"
                    >
                      Feature this event on homepage
                    </label>
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <label className={labelClass}>Publish Status</label>
                <div className="flex gap-4 mt-2">
                  {["published", "draft"].map((s) => (
                    <label
                      key={s}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all
                      ${form.status === s ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600"}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={form.status === s}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-sm font-semibold">
                        {s === "published"
                          ? "🟢 Publish Now"
                          : "🟡 Save as Draft"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-4 justify-end pb-8">
                <Link
                  to="/admin/dashboard"
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >
                  <FaSave />
                  {loading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateEvent;
