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

  const styles = {
    navbar: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      borderBottom: "1px solid rgba(102, 126, 234, 0.1)",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "22px",
      fontWeight: "800",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textDecoration: "none",
      transition: "transform 0.2s",
      cursor: "pointer",
    },
    brandIcon: {
      fontSize: "24px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    desktopNav: {
      display: "flex",
      alignItems: "center",
      gap: "32px",
      flex: 1,
      justifyContent: "center",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    navButton: {
      padding: "10px 24px",
      fontSize: "15px",
      fontWeight: "600",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      whiteSpace: "nowrap",
    },
    activeButton: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    },
    inactiveButton: {
      background: "transparent",
      color: "#667eea",
      border: "2px solid #667eea",
    },
    rightSection: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "8px 16px",
      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
      borderRadius: "50px",
      border: "1px solid rgba(102, 126, 234, 0.2)",
    },
    userAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "18px",
      fontWeight: "700",
    },
    userDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    userName: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#1f2937",
      lineHeight: "1",
    },
    userRole: {
      fontSize: "12px",
      color: "#6b7280",
      lineHeight: "1",
    },
    logoutButton: {
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "600",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      color: "white",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)",
    },
    loginButton: {
      padding: "10px 24px",
      fontSize: "15px",
      fontWeight: "600",
      background: "transparent",
      color: "#667eea",
      border: "2px solid #667eea",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    },
    registerButton: {
      padding: "10px 24px",
      fontSize: "15px",
      fontWeight: "600",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    },
    mobileMenuButton: {
      display: "none",
      padding: "8px",
      fontSize: "24px",
      background: "transparent",
      border: "none",
      color: "#667eea",
      cursor: "pointer",
    },
    mobileMenu: {
      position: "fixed",
      top: 0,
      right: 0,
      width: "300px",
      height: "100vh",
      background: "white",
      boxShadow: "-5px 0 30px rgba(0, 0, 0, 0.1)",
      padding: "24px",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      zIndex: 2000,
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    mobileMenuOpen: {
      transform: "translateX(0)",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      zIndex: 1999,
      display: "none",
    },
    overlayOpen: {
      display: "block",
    },
    closeButton: {
      alignSelf: "flex-end",
      padding: "8px",
      fontSize: "24px",
      background: "transparent",
      border: "none",
      color: "#667eea",
      cursor: "pointer",
    },
    mobileNavLinks: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    mobileDivider: {
      height: "1px",
      background: "rgba(102, 126, 234, 0.2)",
      margin: "12px 0",
    },
  };

  const getDashboardPath = () => {
    if (user?.accountType === "Student") return "/user-dashboard";
    if (user?.accountType === "College Admin") return "/admin-dashboard";
    if (user?.accountType === "Super Admin") return "/superadmin-dashboard";
    return "/";
  };

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.container}>
          {/* Brand */}
          <Link
            to="/"
            style={styles.brand}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FaCalendarDays style={styles.brandIcon} />
            <span>CampusHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div style={styles.desktopNav} className="desktop-nav">
            {token && (
              <ul style={styles.navLinks}>
                <li>
                  <Link
                    to="/events"
                    style={{
                      ...styles.navButton,
                      ...(isActive("/events") ? styles.activeButton : styles.inactiveButton),
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive("/events")) {
                        e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
                      }
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive("/events")) {
                        e.currentTarget.style.background = "transparent";
                      }
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <FaCalendar /> Events
                  </Link>
                </li>
                <li>
                  <Link
                    to={getDashboardPath()}
                    style={{
                      ...styles.navButton,
                      ...(isActive("/user-dashboard") ||
                      isActive("/admin-dashboard") ||
                      isActive("/superadmin-dashboard")
                        ? styles.activeButton
                        : styles.inactiveButton),
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(getDashboardPath())) {
                        e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
                      }
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(getDashboardPath())) {
                        e.currentTarget.style.background = "transparent";
                      }
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <FaChartLine /> Dashboard
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Right Section - Desktop */}
          <div style={styles.rightSection} className="desktop-right">
            {token ? (
              <>
                <div style={styles.userInfo}>
                  <div style={styles.userAvatar}>
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.userDetails}>
                    <span style={styles.userName}>{user?.fullName}</span>
                    <span style={styles.userRole}>{user?.accountType}</span>
                  </div>
                </div>
                <button
                  style={styles.logoutButton}
                  onClick={handleLogout}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(245, 87, 108, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(245, 87, 108, 0.3)";
                  }}
                >
                  <FaRightFromBracket /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={styles.loginButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <FaRightToBracket /> Login
                </Link>
                <Link
                  to="/register"
                  style={styles.registerButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
                  }}
                >
                  <FaUserPlus /> Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            style={styles.mobileMenuButton}
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(true)}
          >
            <FaBars />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        style={{
          ...styles.overlay,
          ...(isMenuOpen ? styles.overlayOpen : {}),
        }}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        style={{
          ...styles.mobileMenu,
          ...(isMenuOpen ? styles.mobileMenuOpen : {}),
        }}
      >
        <button style={styles.closeButton} onClick={() => setIsMenuOpen(false)}>
          <FaXmark />
        </button>

        {token && (
          <>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userDetails}>
                <span style={styles.userName}>{user?.fullName}</span>
                <span style={styles.userRole}>{user?.accountType}</span>
              </div>
            </div>
            <div style={styles.mobileDivider} />
          </>
        )}

        {token && (
          <ul style={styles.mobileNavLinks}>
            <li>
              <Link
                to="/events"
                style={{
                  ...styles.navButton,
                  ...(isActive("/events") ? styles.activeButton : styles.inactiveButton),
                  width: "100%",
                  justifyContent: "center",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaCalendar /> Events
              </Link>
            </li>
            <li>
              <Link
                to={getDashboardPath()}
                style={{
                  ...styles.navButton,
                  ...(isActive("/user-dashboard") ||
                  isActive("/admin-dashboard") ||
                  isActive("/superadmin-dashboard")
                    ? styles.activeButton
                    : styles.inactiveButton),
                  width: "100%",
                  justifyContent: "center",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <FaChartLine /> Dashboard
              </Link>
            </li>
          </ul>
        )}

        <div style={styles.mobileDivider} />

        {token ? (
          <button
            style={{ ...styles.logoutButton, width: "100%", justifyContent: "center" }}
            onClick={handleLogout}
          >
            <FaRightFromBracket /> Logout
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              to="/login"
              style={{ ...styles.loginButton, width: "100%", justifyContent: "center" }}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaRightToBracket /> Login
            </Link>
            <Link
              to="/register"
              style={{ ...styles.registerButton, width: "100%", justifyContent: "center" }}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUserPlus /> Register
            </Link>
          </div>
        )}
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav,
          .desktop-right {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;
