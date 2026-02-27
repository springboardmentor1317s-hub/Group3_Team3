import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADDED
import api from "../../services/api";

function CreateEvent() {
  const navigate = useNavigate(); // ✅ ADDED

  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    description: "",
    category: "",
    college_id: "",
    organizer: "",
    location: "",
    venue: "",

    // Dates
    start_date: "",
    end_date: "",
    registration_start: "",
    registration_end: "",

    // Registration
    max_participants: "",
    registration_fee: "",
    event_type: "",
    status: "draft",

    // Media & Features
    image_url: null,
    tags: "",
    requirements: "",
    is_featured: false,

    // Nested Objects
    prizes: [{ position: "", prize: "", amount: "" }],
    schedule: [{ time: "", activity: "", description: "" }],
    contact: { email: "", phone: "", website: "" },
    social_links: { facebook: "", instagram: "", twitter: "", linkedin: "" },

    // Advanced
    rules_and_regulations: "",
    eligibility: "",
    certificates: false,
    certificate_template: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNestedChange = (section, index, field, value) => {
    const newSection = formData[section].map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setFormData({ ...formData, [section]: newSection });
  };

  const addNestedItem = (section) => {
    const emptyItem =
      section === "prizes"
        ? { position: "", prize: "", amount: "" }
        : { time: "", activity: "", description: "" };
    setFormData({ ...formData, [section]: [...formData[section], emptyItem] });
  };

  const removeNestedItem = (section, index) => {
    setFormData({
      ...formData,
      [section]: formData[section].filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title?.trim()) {
      alert("❌ Event title is required");
      return;
    }
    if (!formData.description?.trim()) {
      alert("❌ Event description is required");
      return;
    }
    if (!formData.location?.trim()) {
      alert("❌ Event location is required");
      return;
    }
    if (!formData.organizer?.trim()) {
      alert("❌ Organizer name is required");
      return;
    }
    if (!formData.start_date) {
      alert("❌ Start date is required");
      return;
    }
    if (!formData.end_date) {
      alert("❌ End date is required");
      return;
    }
    if (!formData.registration_end) {
      alert("❌ Registration deadline is required");
      return;
    }
    if (!formData.category) {
      alert("❌ Event category is required");
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      venue: formData.venue || "",
      organizer: formData.organizer,
      start_date: formData.start_date,
      end_date: formData.end_date,
      registration_start: formData.registration_start || new Date(),
      registration_end: formData.registration_end,
      max_participants: formData.max_participants || 100,
      registration_fee: formData.registration_fee || 0,
      event_type: formData.event_type || "offline",
      status: formData.status || "draft",
      tags: formData.tags || "",
      requirements: formData.requirements || "",
      is_featured: formData.is_featured || false,
      prizes: formData.prizes || [],
      schedule: formData.schedule || [],
      contact: formData.contact || {},
      social_links: formData.social_links || {},
      rules_and_regulations: formData.rules_and_regulations || "",
      eligibility: formData.eligibility || "",
      certificates: formData.certificates || false,
      certificate_template: formData.certificate_template || "",
    };

    try {
      const result = await api.post("/events/create", eventData);

      if (result.status === 200 || result.status === 201) {
        alert("✅ Event Created Successfully!");
        // ✅ ADDED: Redirect to dashboard after success
        navigate("/admin/dashboard");
      } else {
        alert("❌ " + (result.data?.message || "Failed to create event"));
      }
    } catch (error) {
      alert(
        "❌ " +
          (error.response?.data?.message || error.message || "Server error!"),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 p-6">
      <form onSubmit={handleSubmit}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent mb-16 text-center drop-shadow-2xl">
            Create Campus Event
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT: Basic + Registration */}
            <div className="bg-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl p-10 border border-white/20 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-10 border-b-4 border-purple-200 pb-6">
                📋 Basic Information
              </h2>

              {/* Title */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-700 mb-4 tracking-wide">
                  Event Title *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-8 py-6 text-xl bg-white/80 border-2 border-gray-200/50 rounded-3xl 
                            focus:ring-4 focus:ring-purple-400/60 focus:border-purple-400 shadow-xl 
                            hover:shadow-2xl hover:border-purple-300/70 transition-all duration-500 
                            placeholder:text-gray-400 placeholder:italic"
                  placeholder="Enter captivating event title..."
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-10">
                <label className="block text-lg font-bold text-gray-700 mb-4 tracking-wide">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-8 py-6 text-lg bg-white/80 border-2 border-gray-200/50 rounded-3xl 
                            focus:ring-4 focus:ring-purple-400/60 focus:border-purple-400 shadow-xl 
                            hover:shadow-2xl hover:border-purple-300/70 transition-all duration-500 
                            resize-vertical placeholder:text-gray-400"
                  placeholder="Share the excitement of your event..."
                  required
                />
              </div>

              {/* Category + College ID */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-5 bg-white/80 border-2 border-gray-200/50 rounded-2xl 
                              focus:ring-4 focus:ring-emerald-400/60 focus:border-emerald-400 shadow-xl 
                              hover:shadow-2xl hover:border-emerald-300/70 transition-all duration-500"
                  >
                    <option value="">✨ Select Category</option>
                    <option value="cultural">🎭 Cultural</option>
                    <option value="technical">💻 Technical</option>
                    <option value="sports">⚽ Sports</option>
                    <option value="workshop">📚 Workshop</option>
                    <option value="hackathon">💡 Hackathon</option>
                    <option value="seminar">🎤 Seminar</option>
                    <option value="other">🌟 Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    College ID
                  </label>
                  <input
                    name="college_id"
                    value={formData.college_id}
                    onChange={handleInputChange}
                    className="w-full px-6 py-5 bg-white/80 border-2 border-gray-200/50 rounded-2xl 
                              focus:ring-4 focus:ring-blue-400/60 focus:border-blue-400 shadow-xl 
                              hover:shadow-2xl hover:border-blue-300/70 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Location + Venue */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    Location *
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-5 bg-white/80 border-2 border-gray-200/50 rounded-2xl 
                              focus:ring-4 focus:ring-indigo-400/60 shadow-xl hover:shadow-2xl transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">
                    Venue *
                  </label>
                  <input
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-6 py-5 bg-white/80 border-2 border-gray-200/50 rounded-2xl 
                              focus:ring-4 focus:ring-orange-400/60 focus:border-orange-400 shadow-xl 
                              hover:shadow-2xl hover:border-orange-300/70 transition-all duration-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Organizer *
                </label>
                <input
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  className="w-full px-6 py-5 bg-white/80 border-2 border-gray-200/50 rounded-2xl 
                            focus:ring-4 focus:ring-teal-400/60 focus:border-teal-400 shadow-xl 
                            hover:shadow-2xl transition-all duration-500"
                  required
                />
              </div>

              {/* Dates & Registration */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-10 rounded-3xl border-4 border-emerald-200/50 mb-10">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-8">
                  📅 Dates & Registration
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-gray-700 mb-3">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-5 bg-white/90 border-2 border-emerald-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-3">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-5 bg-white/90 border-2 border-emerald-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-3">
                      Registration Start
                    </label>
                    <input
                      type="date"
                      name="registration_start"
                      value={formData.registration_start}
                      onChange={handleInputChange}
                      className="w-full px-6 py-5 bg-white/90 border-2 border-emerald-200/50 rounded-2xl shadow-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-3">
                      Registration End *
                    </label>
                    <input
                      type="date"
                      name="registration_end"
                      value={formData.registration_end}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-5 bg-white/90 border-2 border-emerald-200/50 rounded-2xl shadow-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t-2 border-emerald-200">
                  <div>
                    <label className="block font-bold text-gray-700 mb-3">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      name="max_participants"
                      value={formData.max_participants}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-6 py-5 bg-white/90 border-2 border-purple-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-3">
                      Registration Fee ₹
                    </label>
                    <input
                      type="number"
                      name="registration_fee"
                      value={formData.registration_fee}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-6 py-5 bg-white/90 border-2 border-amber-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Advanced */}
            <div className="space-y-8">
              {/* Media Upload */}
              <div className="bg-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl p-10 border border-white/20 hover:shadow-3xl transition-all">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-8">
                  🖼️ Media & Features
                </h2>
                <div className="mb-8">
                  <label className="block text-lg font-bold text-gray-700 mb-4">
                    Event Banner Image
                  </label>
                  <input
                    type="file"
                    name="image_url"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full px-8 py-8 border-4 border-dashed border-purple-300/50 rounded-3xl 
                              bg-gradient-to-r from-purple-50/80 to-indigo-50/80 hover:from-purple-100 hover:to-indigo-100
                              backdrop-blur-xl cursor-pointer transition-all duration-500 hover:shadow-2xl
                              file:mr-6 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:bg-gradient-to-r 
                              file:from-purple-500 file:to-indigo-500 file:text-white file:font-bold 
                              file:shadow-xl hover:file:shadow-2xl file:transform file:hover:scale-105"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-gray-700 mb-3">
                      Tags
                    </label>
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-6 py-5 bg-white/80 border-2 border-gray-200/50 rounded-2xl 
                                focus:ring-4 focus:ring-pink-400/60 shadow-xl hover:shadow-2xl transition-all"
                      placeholder="tech, hackathon, coding"
                    />
                  </div>
                  <div
                    className="flex items-center justify-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 
                                 rounded-2xl border-2 border-emerald-200/50 hover:border-emerald-400/70"
                  >
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="w-8 h-8 text-emerald-600 rounded-xl mr-4 focus:ring-emerald-500 border-2 border-emerald-400 shadow-lg transform hover:scale-110"
                    />
                    <span className="text-xl font-bold text-emerald-800">
                      ⭐ Featured Event
                    </span>
                  </div>
                </div>
              </div>

              {/* Prizes */}
              <div className="bg-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl p-8 border border-white/20">
                <h3
                  className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent 
                              mb-6 flex items-center justify-between"
                >
                  🏆 Prizes
                  <button
                    type="button"
                    onClick={() => addNestedItem("prizes")}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold 
                              rounded-2xl shadow-xl hover:from-green-600 hover:to-emerald-600 
                              transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                  >
                    + Add Prize
                  </button>
                </h3>
                {formData.prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl mb-4 shadow-xl hover:shadow-2xl border border-white/50 transition-all"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        placeholder="1st"
                        value={prize.position}
                        onChange={(e) =>
                          handleNestedChange(
                            "prizes",
                            index,
                            "position",
                            e.target.value,
                          )
                        }
                        className="px-4 py-3 border-2 border-gray-200/50 rounded-xl bg-white/80 shadow-md focus:ring-2 focus:ring-yellow-400 hover:shadow-lg transition-all text-sm"
                      />
                      <input
                        placeholder="Trophy"
                        value={prize.prize}
                        onChange={(e) =>
                          handleNestedChange(
                            "prizes",
                            index,
                            "prize",
                            e.target.value,
                          )
                        }
                        className="px-4 py-3 border-2 border-gray-200/50 rounded-xl bg-white/80 shadow-md focus:ring-2 focus:ring-yellow-400 hover:shadow-lg transition-all text-sm"
                      />
                      <input
                        type="number"
                        placeholder="₹5000"
                        value={prize.amount}
                        onChange={(e) =>
                          handleNestedChange(
                            "prizes",
                            index,
                            "amount",
                            e.target.value,
                          )
                        }
                        className="px-4 py-3 border-2 border-gray-200/50 rounded-xl bg-white/80 shadow-md focus:ring-2 focus:ring-yellow-400 hover:shadow-lg transition-all text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNestedItem("prizes", index)}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white 
                                 font-bold rounded-xl hover:from-red-600 hover:to-rose-600 
                                 transform hover:scale-105 transition-all duration-200 text-sm"
                    >
                      ❌ Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full col-span-2 lg:col-span-1 bg-gradient-to-r 
                        from-purple-600 via-indigo-600 to-pink-600 text-white py-8 px-12 
                        rounded-3xl text-2xl font-black shadow-2xl hover:shadow-purple-500/50
                        hover:from-purple-700 hover:via-indigo-700 hover:to-pink-700 
                        transform hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500
                        flex items-center justify-center space-x-4 tracking-wide"
              >
                <span className="text-3xl">🚀</span>
                <span>Create Epic Event</span>
                <span className="text-3xl">✨</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
