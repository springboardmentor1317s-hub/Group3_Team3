// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGraduationCap, FaBars, FaTimes, FaBell, FaSignOutAlt } from "react-icons/fa";

// ── Get logged-in user from localStorage (your existing auth pattern) ─────────
const getUser = () => {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { return null; }
};

// ── Role-based nav links ──────────────────────────────────────────────────────
const roleLinks = {
  student: [
    { to: "/student/events",         label: "Browse Events" },
    { to: "/student/dashboard",      label: "Dashboard"     },
    { to: "/student/registrations",  label: "My Registrations" },
    { to: "/student/notifications",  label: "Notifications" },
  ],
  college_admin: [
    { to: "/events",                          label: "Events"        },
    { to: "/admin/dashboard",                 label: "Dashboard"     },
    { to: "/admin/dashboard/create-event",    label: "Create Event"  },
    { to: "/admin/dashboard/events",          label: "My Events"     },
    { to: "/admin/feedback-analytics",        label: "Feedback"      },
  ],
  super_admin: [
    { to: "/events",                    label: "Events"         },
    { to: "/super-admin/dashboard",     label: "Dashboard"      },
    { to: "/super-admin/colleges",      label: "Colleges"       },
    { to: "/super-admin/all-events",    label: "All Events"     },
    { to: "/super-admin/reports",       label: "Analytics"      },
  ],
};

export default function Navbar() {
  const user          = getUser();
  const location      = useLocation();
  const navigate      = useNavigate();
  const [menuOpen, setMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // ✅ FIXED (using role instead of accountType)
 // Navbar.jsx getDashboardPath() - EXACT:
const getDashboardPath = () => {
  const role = user?.role?.toLowerCase().trim();
  if (role.includes("student")) return "/student-dashboard";
  if (role.includes("college")) return "/collegeAdmin-dashboard";  // ← FLEXIBLE MATCH
  if (role.includes("super")) return "/superAdmin-dashboard";
  return "/event-organizer";
};


  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* ── Logo + Brand ───────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* Logo icon */}
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-indigo-200 group-hover:shadow-lg transition-all duration-300">
            <FaGraduationCap className="text-white text-lg" />
          </div>
          {/* Brand name */}
          <span className="font-extrabold text-lg tracking-tight">
            <span className="text-indigo-600">Campus</span>
            <span className="text-purple-600">Hub</span>
          </span>
        </Link>

            {/* Desktop Navigation - 3 BUTTONS */}
<div className="hidden md:flex items-center justify-center flex-1 gap-3">
  {token && (
    <>
      {/* 1. HOME BUTTON */}
      <Link
        to="/"
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base transition-all duration-300
          ${isActive("/") 
            ? "bg-white text-purple-600 border-2 border-purple-600 shadow-md"
            : "bg-white text-purple-600 border-2 border-purple-400 hover:border-purple-600"
          }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.67 2.292a1 1 0 00-1.34 0l-7 7 1.41 1.41L10 4.42l6.93 6.29 1.41-1.41-7-7z"/>
        </svg>
        <span>Home</span>
      </Link>

      {/* 2. MY EVENTS BUTTON */}
      <Link
        to="/my-events"
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base transition-all duration-300
          ${isActive("/my-events")
            ? "bg-white text-purple-600 border-2 border-purple-600 shadow-md"
            : "bg-white text-purple-600 border-2 border-purple-400 hover:border-purple-600"
          }`}
      >
        <FaCalendar />
        <span>My Events</span>
      </Link>

      {/* 3. DASHBOARD BUTTON */}
      <Link
        to={getDashboardPath()}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-base transition-all duration-300
          ${
            isActive("/student-dashboard") ||
            isActive("/collegeAdmin-dashboard") ||
            isActive("/superAdmin-dashboard") ||
            isActive("/event-organizer")
              ? "bg-white text-purple-600 border-2 border-purple-600 shadow-md"
              : "bg-white text-purple-600 border-2 border-purple-400 hover:border-purple-600"
          }`}
      >
        <FaChartLine />
        <span>Dashboard</span>
      </Link>
    </>
  )}
</div>


            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-4">
              {token ? (
                <>
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {getInitials(user?.name)}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <FaRightFromBracket />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-purple-600 border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300"
                  >
                    <FaRightToBracket />
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300"
                  >
                    <FaUserPlus />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
            </div>
            </div>

      </nav>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden
        transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-6">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="self-end p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
          >
            <FaXmark className="text-2xl" />
          </button>

          {token && (
            <>
              <div className="flex items-center gap-3 px-4 py-3 mt-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {getInitials(user?.name)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-800 leading-tight">{user.name?.split(" ")[0]}</div>
                  <div className="text-[10px] text-gray-400 capitalize">{user.role?.replace("_"," ")}</div>
                </div>
              </div>

              {/* Logout */}
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-all">
                <FaSignOutAlt/> Logout
              </button>

              {/* Mobile hamburger */}
              <button onClick={()=>setMenu(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-50">
                {menuOpen ? <FaTimes className="text-gray-600 text-lg"/> : <FaBars className="text-gray-600 text-lg"/>}
              </button>
            </>
          ) : (
            /* Public — Login + Register */
            <div className="flex items-center gap-3">
              <Link to="/login"
                className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-indigo-500 text-indigo-600 font-bold rounded-full text-sm hover:bg-indigo-50 transition-all no-underline">
                🔐 Login
              </Link>
              <Link to="/register"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline">
                👤 Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────── */}
      {menuOpen && user && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={()=>setMenu(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                location.pathname===l.to
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}>
              {l.label}
            </Link>
          ))}
          <button onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all">
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
}