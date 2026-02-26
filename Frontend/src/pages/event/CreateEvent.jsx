import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "sports",
    location: "",
    start_date: "",
    end_date: "",
    banner: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized! Please log in again.");
        navigate("/login");
        return;
      }

      const response = await api.post("/events/create_events", formData, {
        headers: { Authorization: `Bearer ${token}` },
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
        toast.error(error.response.data?.message || "Server error while creating event");
      } else if (error.request) {
        toast.error("No response from server. Please check your internet connection.");
      } else {
        toast.error("Unexpected error occurred while creating the event.");
      }
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition";

  return (
    <>
    <Navbar />
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🗓️ Create Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            className={inputClass}
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            className={`${inputClass} resize-none`}
            placeholder="Event Description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* Category */}
          <select
            name="category"
            className={inputClass}
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="sports">Sports</option>
            <option value="hackathon">Hackathon</option>
            <option value="cultural">Cultural</option>
            <option value="workshop">Workshop</option>
            <option value="other">Other</option>
          </select>

          {/* Location */}
          <input
            type="text"
            name="location"
            className={inputClass}
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          {/* Start & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                className={inputClass}
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                className={inputClass}
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Banner URL */}
          <input
            type="text"
            name="banner"
            className={inputClass}
            placeholder="Banner Image URL"
            value={formData.banner}
            onChange={handleChange}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <span>＋</span> Create Event
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default CreateEvent;