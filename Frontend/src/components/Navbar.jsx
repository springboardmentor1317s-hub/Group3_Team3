import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeToken, getToken } from "../services/auth";
import { toast } from "react-toastify";
import { FaCalendarDays, FaCalendar, FaChartLine, FaRightFromBracket, FaRightToBracket, FaUserPlus, FaBars, FaXmark } from "react-icons/fa6";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
    navigate("/");
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (user?.accountType === "Student") return "/user-dashboard";
    if (user?.accountType === "College Admin") return "/admin-dashboard";
    if (user?.accountType === "Super Admin") return "/superadmin-dashboard";
    return "/";
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
              <span className="text-3xl font-black bg-linear-to-r from-purple-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                CampusHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-3">
              {token && (
                <>
                  <Link
                    to="/events"
                    className={`
                      flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-base transition-all duration-300
                      ${isActive("/events")
                        ? "bg-white text-purple-600 border-2 border-purple-600 shadow-md"
                        : "bg-white text-purple-600 border-2 border-purple-400 hover:border-purple-600"
                      }
                    `}
                  >
                    <FaCalendar className="text-lg" />
                    <span>Events</span>
                  </Link>
                  
                  <Link
                    to={getDashboardPath()}
                    className={`
                      flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-base transition-all duration-300
                      ${(isActive("/user-dashboard") ||
                        isActive("/admin-dashboard") ||
                        isActive("/superadmin-dashboard"))
                        ? "bg-white text-purple-600 border-2 border-purple-600 shadow-md"
                        : "bg-white text-purple-600 border-2 border-purple-400 hover:border-purple-600"
                      }
                    `}
                  >
                    <FaChartLine className="text-lg" />
                    <span>Dashboard</span>
                  </Link>
                </>
              )}
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {token ? (
                <>
                  {/* User Avatar */}
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transition-all duration-300"
                  >
                    <FaRightFromBracket className="text-base" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-purple-600 border-2 border-purple-600 hover:bg-purple-50 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <FaRightToBracket className="text-base" />
                    <span>Login</span>
                  </Link>
                  
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <FaUserPlus className="text-base" />
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="self-end p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
          >
            <FaXmark className="text-2xl" />
          </button>

          {/* User Info - Mobile */}
          {token && (
            <>
              <div className="flex items-center gap-3 px-4 py-3 mt-4 bg-linear-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 leading-tight">
                    {user?.fullName}
                  </span>
                  <span className="text-xs text-slate-600 leading-tight">
                    {user?.accountType}
                  </span>
                </div>
              </div>
              <div className="h-px bg-linear-to-r from-purple-200 to-blue-200 my-6" />
            </>
          )}

          {/* Navigation Links - Mobile */}
          {token && (
            <nav className="flex flex-col gap-3">
              <Link
                to="/events"
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300
                  ${isActive("/events")
                    ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                    : "text-purple-600 border-2 border-purple-600 hover:bg-purple-50"
                  }
                `}
              >
                <FaCalendar className="text-lg" />
                <span>Events</span>
              </Link>
              
              <Link
                to={getDashboardPath()}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300
                  ${(isActive("/user-dashboard") ||
                    isActive("/admin-dashboard") ||
                    isActive("/superadmin-dashboard"))
                    ? "bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                    : "text-purple-600 border-2 border-purple-600 hover:bg-purple-50"
                  }
                `}
              >
                <FaChartLine className="text-lg" />
                <span>Dashboard</span>
              </Link>
            </nav>
          )}

          <div className="h-px bg-linear-to-r from-purple-200 to-blue-200 my-6" />

          {/* Auth Buttons - Mobile */}
          <div className="flex flex-col gap-3 mt-auto">
            {token ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/50 hover:shadow-xl transition-all duration-300"
              >
                <FaRightFromBracket className="text-lg" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm text-purple-600 border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300"
                >
                  <FaRightToBracket className="text-lg" />
                  <span>Login</span>
                </Link>
                
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-xl transition-all duration-300"
                >
                  <FaUserPlus className="text-lg" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;