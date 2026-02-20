import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeToken, getToken } from "../services/auth";
import { toast } from "react-toastify";
import {
  FaCalendar,
  FaChartLine,
  FaRightFromBracket,
  FaRightToBracket,
  FaUserPlus,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Get First & Last Initials (HS format)
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/");
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // ✅ FIXED (using role instead of accountType)
  const getDashboardPath = () => {
    if (user?.role === "student") return "/student-dashboard";
    if (user?.role === "college admin") return "/admin-dashboard";
    if (user?.role === "super admin") return "/superadmin-dashboard";
    return "/";
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl font-black bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                CampusHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-3">
              {token && (
                <>
                  <Link
                    to="/events"
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-base transition-all duration-300
                      ${
                        isActive("/events")
                          ? "bg-white text-purple-600 border-2 border-purple-600 shadow-md"
                          : "bg-white text-purple-600 border-2 border-purple-400 hover:border-purple-600"
                      }`}
                  >
                    <FaCalendar />
                    <span>Events</span>
                  </Link>

                  <Link
                    to={getDashboardPath()}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-base transition-all duration-300
                      ${
                        isActive("/student-dashboard") ||
                        isActive("/admin-dashboard") ||
                        isActive("/superadmin-dashboard")
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
            >
              <FaBars className="text-2xl" />
            </button>
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
                <div>
                  <p className="text-sm font-bold">{user?.name}</p>
                  <p className="text-xs text-slate-600">{user?.role}</p>
                </div>
              </div>
            </>
          )}

          <div className="mt-auto">
            {token && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg"
              >
                <FaRightFromBracket />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
