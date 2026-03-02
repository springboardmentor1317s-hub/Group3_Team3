import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaSave,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaUsers,
  FaImage,
  FaTimes,
} from "react-icons/fa";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
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
const STATUSES = ["draft", "published", "ongoing", "completed", "cancelled"];
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

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api
      .get(`/events/${id}`)
      .then((r) => {
        const e = r.data.event;
        setExistingImage(e.image_url || null);
        setForm({
          title: e.title || "",
          description: e.description || "",
          category: e.category || "other",
          event_type: e.event_type || "offline",
          location: e.location || "",
          venue: e.venue || "",
          start_date: e.start_date
            ? new Date(e.start_date).toISOString().slice(0, 16)
            : "",
          end_date: e.end_date
            ? new Date(e.end_date).toISOString().slice(0, 16)
            : "",
          registration_end: e.registration_end
            ? new Date(e.registration_end).toISOString().slice(0, 16)
            : "",
          max_participants: e.max_participants || 100,
          registration_fee: e.registration_fee || 0,
          eligibility: e.eligibility || "Open to all college students",
          requirements: e.requirements || "",
          tags: (e.tags || []).join(", "),
          status: e.status || "published",
          certificates: e.certificates || false,
          is_featured: e.is_featured || false,
          rules_and_regulations: e.rules_and_regulations || "",
        });
      })
      .catch(() => toast.error("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

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

  const removeNewImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
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

      await api.put(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Event updated successfully! ✅");
      navigate("/admin/dashboard/events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Loading event...</p>
          </div>
        </div>
      </>
    );

  if (!form)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
          <div className="text-center">
            <p className="text-slate-600 font-medium">Event not found.</p>
            <Link
              to="/admin/dashboard/events"
              className="mt-4 inline-block text-indigo-600 font-bold hover:underline"
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </>
    );

  const currentImageSrc =
    imagePreview || (existingImage ? `${API_BASE}${existingImage}` : null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/admin/dashboard/events"
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              <FaArrowLeft className="text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Edit Event</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Update your event details
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* IMAGE */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <FaImage className="text-indigo-500" /> Event Banner Image
                </h2>
                {currentImageSrc ? (
                  <div className="relative">
                    <img
                      src={currentImageSrc}
                      alt="Event banner"
                      className="w-full h-56 object-cover rounded-xl border-2 border-indigo-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeNewImage}
                        className="absolute top-3 right-3 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-lg"
                      >
                        <FaTimes />
                      </button>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition"
                      >
                        🔄 Change Image
                      </button>
                      {imageFile && (
                        <p className="text-xs text-slate-500">
                          New: {imageFile.name} (
                          {(imageFile.size / 1024).toFixed(0)} KB)
                        </p>
                      )}
                    </div>
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
                      className={inputClass + " resize-none"}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
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
                    <label className={labelClass}>Event Type</label>
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
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
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
                      className={inputClass}
                      placeholder="e.g. Mumbai, Maharashtra"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Venue Name</label>
                    <input
                      name="venue"
                      value={form.venue}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. City Cultural Center"
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
                    <label className={labelClass}>Start Date & Time</label>
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={form.start_date}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>End Date & Time</label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={form.end_date}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Registration Deadline</label>
                    <input
                      type="datetime-local"
                      name="registration_end"
                      value={form.registration_end}
                      onChange={handleChange}
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
                      className={inputClass}
                      placeholder="Who can participate?"
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
                      className={inputClass}
                      placeholder="e.g. coding, innovation, prizes"
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

              {/* ACTIONS */}
              <div className="flex items-center gap-4 justify-end pb-8">
                <Link
                  to="/admin/dashboard/events"
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >
                  <FaSave />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditEvent;