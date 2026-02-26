import React from "react";
import heroImg from "../assets/heroimg.png";
import { Link } from "react-router-dom";
import { FaCalendarCheck, FaArrowRight, FaUsers, FaStar, FaTrophy } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center relative overflow-hidden py-20 px-5">
        {/* Decorative Circles */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 -top-24 -right-24 blur-[60px] pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/10 -bottom-12 -left-12 blur-[60px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-14 flex-wrap">

            {/* Left Section */}
            <div className="flex-1 min-w-[300px] text-white">
              <span className="inline-block px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-widest uppercase mb-5 border border-white/30">
                🎓 Discover • Connect • Experience
              </span>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                Your Gateway to <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Every College Event
                </span>
              </h1>

              <p className="text-lg leading-relaxed text-white/90 mb-8 max-w-2xl">
                From tech fests to cultural nights, competitions to workshops —
                stay updated and never miss out on what's happening around you.
                Join thousands of students discovering amazing events every day.
              </p>

              {/* Buttons */}
              <div className="flex gap-4 flex-wrap mb-10">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-bold text-indigo-600 bg-white rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl no-underline"
                >
                  <FaCalendarCheck /> Explore Events
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-bold text-white bg-white/20 border-2 border-white/30 rounded-full backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:border-white/50 no-underline"
                >
                  Get Started <FaArrowRight />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 flex-wrap">
                {[
                  { icon: <FaUsers />, number: "10K+", label: "Active Students" },
                  { icon: <FaCalendarCheck />, number: "500+", label: "Events Monthly" },
                  { icon: <FaStar />, number: "4.9★", label: "User Rating" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                      {stat.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold leading-none mb-1">{stat.number}</span>
                      <span className="text-xs opacity-90">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 min-w-[300px] flex justify-center items-center">
              <div className="relative max-w-md w-full">
                {/* Image */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105"
                  style={{ transform: "perspective(1000px) rotateY(-5deg)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "perspective(1000px) rotateY(-5deg)")}
                >
                  <img
                    src={heroImg}
                    alt="Campus Events Illustration"
                    className="w-full h-auto block"
                  />
                </div>

                {/* Floating Card 1 */}
                <div
                  className="absolute top-5 -left-5 bg-white rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3"
                  style={{ animation: "float 3s ease-in-out infinite" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white text-lg">
                    <FaTrophy />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">Tech Fest 2026</span>
                    <span className="text-xs text-gray-500">250+ Participants</span>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div
                  className="absolute bottom-10 -right-5 bg-white rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3"
                  style={{ animation: "float 3s ease-in-out infinite 1.5s" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg bg-gradient-to-br from-pink-400 to-rose-500">
                    <FaCalendarCheck />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">Live Events</span>
                    <span className="text-xs text-gray-500">32 Happening Now</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Float animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </section>
    </>
  );
};

export default Home;
