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

  const links = roleLinks[user?.role] || [];

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

        {/* ── Desktop nav links (logged-in users) ────────────────── */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === l.to
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* ── Right side ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notifications bell */}
              <Link
                to={user.role==="student" ? "/student/notifications" : "/admin/notifications"}
                className="relative p-2 rounded-xl hover:bg-gray-50 transition-all"
              >
                <FaBell className="text-gray-500 text-lg" />
              </Link>

              {/* User avatar + name */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                  {user.name?.[0]?.toUpperCase()}
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