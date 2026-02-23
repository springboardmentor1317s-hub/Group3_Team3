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
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-600 text-2xl font-extrabold"
            >
              CampusHub
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-4">
              {token && (
                <>
                  <Link
                    to="/events"
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
                      ${
                        isActive("/events")
                          ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                          : "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                      }`}
                  >
                    <FaCalendar className="text-lg" />
                    <span>Events</span>
                  </Link>

                  <Link
                    to={getDashboardPath()}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
                      ${
                        isActive("/user-dashboard") ||
                        isActive("/admin-dashboard") ||
                        isActive("/superadmin-dashboard")
                          ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                          : "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                      }`}
                  >
                    <FaChartLine className="text-lg" />
                    <span>Dashboard</span>
                  </Link>
                </>
              )}
            </div>

            {/* Right Section (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              {token ? (
                <>
                  <div className="flex items-center gap-3 pl-3 pr-5 py-2 border border-indigo-200 bg-linear-to-r from-indigo-50 to-purple-50 rounded-full shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md uppercase">
                      {user?.fullName?.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.accountType}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-pink-500 to-red-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <FaRightFromBracket /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-indigo-500 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-all"
                  >
                    <FaRightToBracket /> Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <FaUserPlus /> Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
              <FaBars className="text-2xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="self-end p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
          >
            <FaXmark className="text-2xl" />
          </button>

          {/* User Info */}
          {token && (
            <>
              <div className="flex items-center gap-3 px-4 py-3 mt-6 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {user?.fullName?.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 text-sm">
                    {user?.fullName}
                  </span>
                  <span className="text-xs text-gray-600">{user?.accountType}</span>
                </div>
              </div>
              <hr className="my-6 border-indigo-200" />
            </>
          )}

          <nav className="flex flex-col gap-3">
            {token && (
              <>
                <Link
                  to="/events"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-lg font-semibold text-sm transition-all
                    ${
                      isActive("/events")
                        ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                        : "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                    }`}
                >
                  <FaCalendar /> Events
                </Link>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-lg font-semibold text-sm transition-all
                    ${
                      isActive("/user-dashboard") ||
                      isActive("/admin-dashboard") ||
                      isActive("/superadmin-dashboard")
                        ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                        : "border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                    }`}
                >
                  <FaChartLine /> Dashboard
                </Link>
              </>
            )}
          </nav>

          <hr className="my-6 border-indigo-200" />

          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-linear-to-r from-pink-500 to-red-500 text-white font-semibold text-sm shadow-md hover:shadow-lg transition"
            >
              <FaRightFromBracket /> Logout
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-indigo-500 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition"
              >
                <FaRightToBracket /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition"
              >
                <FaUserPlus /> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
