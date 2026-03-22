import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

import EventComments from "./components/EventComments"; // ✅ added

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaRupeeSign,
  FaTag,
  FaArrowLeft,
  FaCommentAlt,
  FaUserShield,
} from "react-icons/fa";

function CollegeEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event || response.data);
    } catch (error) {
      toast.error("Failed to load event details");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

  const getCategoryColor = (category) => {
    const colors = {
      sports: "bg-green-100 text-green-800",
      hackathon: "bg-blue-100 text-blue-800",
      cultural: "bg-purple-100 text-purple-800",
      workshop: "bg-orange-100 text-orange-800",
      seminar: "bg-red-100 text-red-800",
      technical: "bg-indigo-100 text-indigo-800",
      social: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  const isFull = event && event.current_participants >= event.max_participants;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />

            <p className="mt-4 text-gray-600">Loading event details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!event) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 mb-6 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>

          {/* ── Admin badge notice ─────────────────────────────────────── */}
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3 mb-6">
            <FaUserShield className="text-indigo-600 text-xl flex-shrink-0" />
            <div>
              <p className="font-bold text-indigo-800 text-sm">Admin View</p>
              <p className="text-indigo-600 text-xs mt-0.5">
                You can view and reply to all student comments. Your replies
                will show an <span className="font-bold">Admin</span> badge.
              </p>
            </div>
          </div>

          {/* ── Main Card ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {/* Event banner */}
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-52 object-cover"
              />
            )}

            <div className="p-8">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {event.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(event.category)}`}
                    >
                      <FaTag className="text-xs" /> {event.category}
                    </span>
                    {event.status && (
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          event.status === "published"
                            ? "bg-green-100 text-green-700"
                            : event.status === "completed"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {event.status}
                      </span>
                    )}
                    {event.organizer && (
                      <span className="text-sm text-gray-500">
                        by {event.organizer}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-8">{event.description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-700">
                    <FaCalendarAlt className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Date & Time</p>

                      <p className="text-sm text-gray-600">
                        {formatDate(event.start_date)}
                      </p>
                      {event.end_date &&
                        event.end_date !== event.start_date && (
                          <p className="text-sm text-gray-600">
                            to {formatDate(event.end_date)}
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <FaMapMarkerAlt className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-gray-700">
                    <FaUsers className="text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Participants</p>
                      <p className="text-sm text-gray-600">
                        {event.current_participants || 0} /{" "}
                        {event.max_participants} registered
                      </p>
                      {isFull && (
                        <p className="text-xs text-red-500 font-semibold mt-1">
                          Event is full
                        </p>
                      )}
                    </div>
                  </div>
                  {event.registration_fee > 0 && (
                    <div className="flex items-start gap-3 text-gray-700">
                      <FaRupeeSign className="text-indigo-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Registration Fee</p>

                        <p className="text-sm text-gray-600">
                          ₹{event.registration_fee}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Extra Info Cards */}
          {event.requirements && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Requirements
              </h3>

              <p className="text-gray-600">{event.requirements}</p>
            </div>
          )}
          {event.eligibility && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Eligibility
              </h3>

              <p className="text-gray-600">{event.eligibility}</p>
            </div>
          )}
          {event.rules_and_regulations && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Rules & Regulations
              </h3>
              <p className="text-gray-600 whitespace-pre-line">
                {event.rules_and_regulations}
              </p>
            </div>
          )}

          {/* ── Comments Section ───────────────────────────────────────── */}
          {/* Admin can see all comments and reply — replies show "Admin" badge */}
          <EventComments eventId={id} />
        </div>
      </div>
    </>
  );
}

export default CollegeEventDetails;
