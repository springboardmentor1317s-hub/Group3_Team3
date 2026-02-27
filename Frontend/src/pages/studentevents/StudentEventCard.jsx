// Frontend/src/pages/studentevents/StudentEventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StudentEventCard = ({ event }) => {
  // Category colors & emojis
  const categoryConfig = {
    hackathon: { emoji: '💡', color: 'bg-blue-100 text-blue-800' },
    workshop: { emoji: '📚', color: 'bg-emerald-100 text-emerald-800' },
    cultural: { emoji: '🎭', color: 'bg-purple-100 text-purple-800' },
    sports: { emoji: '⚽', color: 'bg-orange-100 text-orange-800' },
    seminar: { emoji: '🎤', color: 'bg-indigo-100 text-indigo-800' },
    technical: { emoji: '💻', color: 'bg-cyan-100 text-cyan-800' },
    other: { emoji: '🌟', color: 'bg-gray-100 text-gray-800' }
  };

  const category = categoryConfig[event.category?.toLowerCase()] || categoryConfig.other;
  
  // Status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-gradient-to-r from-emerald-500 to-green-600';
      case 'ongoing': return 'bg-gradient-to-r from-orange-500 to-yellow-600';
      case 'completed': return 'bg-gradient-to-r from-gray-500 to-gray-600';
      default: return 'bg-gradient-to-r from-purple-500 to-indigo-600';
    }
  };

  return (
    <Link to={`/student/event/${event.id || event._id}`} className="group block w-full h-full">
      <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col hover:-translate-y-2 hover:border-purple-200 border-2 border-transparent group-hover:border-purple-200">
        
        {/* Event Image/Gradient */}
        <div className="h-56 relative overflow-hidden bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 group-hover:brightness-105 transition-all duration-500">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className={`px-4 py-2 rounded-2xl text-xs font-bold text-white shadow-lg ${getStatusBadge(event.status)}`}>
              {event.status?.toUpperCase() || 'UPCOMING'}
            </span>
          </div>

          {/* Category Icon */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-3xl">{category.emoji}</span>
          </div>

          {/* Gradient overlay for text readability */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-1">
          {/* Category Badge */}
          <div className="flex items-center mb-4">
            <span className={`px-4 py-2 rounded-full text-xs font-bold ${category.color}`}>
              {category.emoji} {event.category}
            </span>
            {event.is_featured && (
              <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-black text-gray-900 mb-4 line-clamp-2 group-hover:text-purple-700 transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 line-clamp-3 flex-1 leading-relaxed">
            {event.description || 'Exciting campus event with great opportunities!'}
          </p>

          {/* Event Details */}
          <div className="space-y-3 mb-8 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
              </svg>
              {new Date(event.start_date || event.date).toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              {event.venue || event.location || 'Campus Venue'}
            </div>

            {/* Registration Info */}
            {event.registeredCount !== undefined && (
              <div className="flex items-center pt-2">
                <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-gray-900">
                  {event.registeredCount || 0}/{event.max_participants || event.spots || 100} registered
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-auto pt-6">
            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group-hover:shadow-purple-500/25">
              View Details →
              <svg className="w-5 h-5 ml-2 inline transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudentEventCard;
