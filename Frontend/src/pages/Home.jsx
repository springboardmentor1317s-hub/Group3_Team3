import React from "react";
import heroImg from "../assets/heroimg.png";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck, FaArrowRight, FaUsers,
  FaStar, FaTrophy, FaBolt, FaGraduationCap,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 flex items-center relative overflow-hidden py-20 px-5">
        {/* Decorative blobs */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-white/10 -top-32 -right-32 blur-[80px] pointer-events-none" />
        <div className="absolute w-[350px] h-[350px] rounded-full bg-white/10 -bottom-16 -left-16 blur-[80px] pointer-events-none" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-yellow-300/10 top-1/2 left-1/3 blur-[60px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-14 flex-wrap">

            {/* ── Left Section ──────────────────────────────────────── */}
            <div className="flex-1 min-w-[300px] text-white">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/25 shadow-sm">
                <FaBolt className="text-yellow-300 text-sm" />
                Discover • Connect • Experience
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
                Your Gateway to <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Every College Event
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg leading-relaxed text-white/85 mb-10 max-w-xl">
                From tech fests to cultural nights, competitions to workshops —
                stay updated and never miss out on what's happening around you.
                Join thousands of students discovering amazing events every day.
              </p>

              {/* Buttons */}
              <div className="flex gap-4 flex-wrap mb-12">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-bold text-indigo-600 bg-white rounded-full shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl no-underline"
                >
                  <FaCalendarCheck /> Explore Events
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-bold text-white bg-white/15 border-2 border-white/30 rounded-full backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:border-white/50 hover:-translate-y-1 no-underline"
                >
                  Get Started <FaArrowRight />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 flex-wrap">
                {[
                  { icon: <FaUsers />,         number: "10K+", label: "Active Students" },
                  { icon: <FaCalendarCheck />, number: "500+", label: "Events Monthly"  },
                  { icon: <FaStar />,          number: "4.9★", label: "User Rating"     },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl shadow-md backdrop-blur-sm">
                      {stat.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-extrabold leading-none mb-0.5">{stat.number}</span>
                      <span className="text-xs text-white/75 font-medium">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right Section ──────────────────────────────────────── */}
            <div className="flex-1 min-w-[300px] flex justify-center items-center">
              <div className="relative max-w-md w-full">

                {/* Main image */}
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-transform duration-500"
                  style={{ transform: "perspective(1000px) rotateY(-5deg)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "perspective(1000px) rotateY(-5deg)")}
                >
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent z-10 pointer-events-none" />
                  <img
                    src={heroImg}
                    alt="Campus Events"
                    className="w-full h-auto block"
                  />
                </div>

                {/* Floating Card 1 — top left */}
                <div
                  className="absolute top-5 -left-6 bg-white rounded-2xl px-4 py-3.5 shadow-2xl flex items-center gap-3 border border-gray-100"
                  style={{ animation: "float 3s ease-in-out infinite" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-base shadow-md">
                    <FaTrophy />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-tight">Tech Fest 2026</p>
                    <p className="text-xs text-gray-500">250+ Participants</p>
                  </div>
                </div>

                {/* Floating Card 2 — bottom right */}
                <div
                  className="absolute bottom-10 -right-6 bg-white rounded-2xl px-4 py-3.5 shadow-2xl flex items-center gap-3 border border-gray-100"
                  style={{ animation: "float 3s ease-in-out infinite 1.5s" }}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-base shadow-md">
                    <FaCalendarCheck />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-tight">Live Events</p>
                    <p className="text-xs text-gray-500">32 Happening Now</p>
                  </div>
                </div>

                {/* Floating pill — top right */}
                <div
                  className="absolute -top-4 right-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1.5"
                  style={{ animation: "float 3s ease-in-out infinite 0.7s" }}
                >
                  <FaStar className="text-white text-xs" /> Top Rated Platform
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Float keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-10px); }
          }
        `}</style>
      </section>
    </>
  );
};

export default Home;