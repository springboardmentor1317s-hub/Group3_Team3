import React from "react";
import heroImg from "../assets/heroimg.png";
import { Link } from "react-router-dom";
import { FaCalendarCheck, FaArrowRight, FaUsers, FaStar, FaTrophy } from "react-icons/fa";

const Hero = () => {
  const styles = {
    section: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      padding: "80px 20px",
    },
    decorativeCircle1: {
      position: "absolute",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      top: "-100px",
      right: "-100px",
      filter: "blur(60px)",
    },
    decorativeCircle2: {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      bottom: "-50px",
      left: "-50px",
      filter: "blur(60px)",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
      position: "relative",
      zIndex: 1,
    },
    row: {
      display: "flex",
      alignItems: "center",
      gap: "60px",
      flexWrap: "wrap",
    },
    leftSection: {
      flex: "1",
      minWidth: "300px",
      color: "white",
    },
    badge: {
      display: "inline-block",
      padding: "8px 20px",
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      borderRadius: "50px",
      fontSize: "13px",
      fontWeight: "600",
      letterSpacing: "1px",
      textTransform: "uppercase",
      marginBottom: "20px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
    },
    title: {
      fontSize: "56px",
      fontWeight: "800",
      lineHeight: "1.1",
      marginBottom: "24px",
      margin: 0,
    },
    gradient: {
      background: "linear-gradient(90deg, #ffd89b 0%, #19547b 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    description: {
      fontSize: "18px",
      lineHeight: "1.7",
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: "32px",
    },
    buttonGroup: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "40px",
    },
    primaryButton: {
      padding: "14px 32px",
      fontSize: "16px",
      fontWeight: "700",
      color: "#667eea",
      background: "white",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
    },
    secondaryButton: {
      padding: "14px 32px",
      fontSize: "16px",
      fontWeight: "700",
      color: "white",
      background: "rgba(255, 255, 255, 0.2)",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s",
      backdropFilter: "blur(10px)",
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
    },
    statsContainer: {
      display: "flex",
      gap: "32px",
      flexWrap: "wrap",
    },
    statItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    statIcon: {
      width: "48px",
      height: "48px",
      background: "rgba(255, 255, 255, 0.2)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
    },
    statContent: {
      display: "flex",
      flexDirection: "column",
    },
    statNumber: {
      fontSize: "24px",
      fontWeight: "700",
      lineHeight: "1",
      marginBottom: "4px",
    },
    statLabel: {
      fontSize: "13px",
      opacity: "0.9",
    },
    rightSection: {
      flex: "1",
      minWidth: "300px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    imageContainer: {
      position: "relative",
      maxWidth: "500px",
      width: "100%",
    },
    imageWrapper: {
      position: "relative",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      transform: "perspective(1000px) rotateY(-5deg)",
      transition: "transform 0.3s",
    },
    image: {
      width: "100%",
      height: "auto",
      display: "block",
    },
    floatingCard: {
      position: "absolute",
      background: "white",
      borderRadius: "16px",
      padding: "16px 20px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      animation: "float 3s ease-in-out infinite",
    },
    floatingCard1: {
      top: "20px",
      left: "-20px",
    },
    floatingCard2: {
      bottom: "40px",
      right: "-20px",
    },
    cardIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      color: "white",
    },
    cardText: {
      display: "flex",
      flexDirection: "column",
    },
    cardTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#1f2937",
      marginBottom: "2px",
    },
    cardSubtitle: {
      fontSize: "12px",
      color: "#6b7280",
    },
  };

  return (
    <section style={styles.section}>
      {/* Decorative Elements */}
      <div style={styles.decorativeCircle1}></div>
      <div style={styles.decorativeCircle2}></div>

      <div style={styles.container}>
        <div style={styles.row}>
          {/* Left Section */}
          <div style={styles.leftSection}>
            <span style={styles.badge}>
              🎓 Discover • Connect • Experience
            </span>
            
            <h1 style={styles.title}>
              Your Gateway to <br />
              <span style={styles.gradient}>Every College Event</span>
            </h1>
            
            <p style={styles.description}>
              From tech fests to cultural nights, competitions to workshops — 
              stay updated and never miss out on what's happening around you. 
              Join thousands of students discovering amazing events every day.
            </p>

            {/* Buttons */}
            <div style={styles.buttonGroup}>
              <Link
                to="/events"
                style={styles.primaryButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
                }}
              >
                <FaCalendarCheck /> Explore Events
              </Link>
              
              <Link
                to="/register"
                style={styles.secondaryButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                }}
              >
                Get Started <FaArrowRight />
              </Link>
            </div>

            {/* Stats */}
            <div style={styles.statsContainer}>
              <div style={styles.statItem}>
                <div style={styles.statIcon}>
                  <FaUsers />
                </div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>10K+</div>
                  <div style={styles.statLabel}>Active Students</div>
                </div>
              </div>

              <div style={styles.statItem}>
                <div style={styles.statIcon}>
                  <FaCalendarCheck />
                </div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>500+</div>
                  <div style={styles.statLabel}>Events Monthly</div>
                </div>
              </div>

              <div style={styles.statItem}>
                <div style={styles.statIcon}>
                  <FaStar />
                </div>
                <div style={styles.statContent}>
                  <div style={styles.statNumber}>4.9★</div>
                  <div style={styles.statLabel}>User Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div style={styles.rightSection}>
            <div style={styles.imageContainer}>
              <div
                style={styles.imageWrapper}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "perspective(1000px) rotateY(-5deg)";
                }}
              >
                <img
                  src={heroImg}
                  alt="Campus Events Illustration"
                  style={styles.image}
                />
              </div>

              {/* Floating Card 1 */}
              <div style={{ ...styles.floatingCard, ...styles.floatingCard1 }}>
                <div style={{ ...styles.cardIcon, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                  <FaTrophy />
                </div>
                <div style={styles.cardText}>
                  <div style={styles.cardTitle}>Tech Fest 2026</div>
                  <div style={styles.cardSubtitle}>250+ Participants</div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div style={{ ...styles.floatingCard, ...styles.floatingCard2 }}>
                <div style={{ ...styles.cardIcon, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                  <FaCalendarCheck />
                </div>
                <div style={styles.cardText}>
                  <div style={styles.cardTitle}>Live Events</div>
                  <div style={styles.cardSubtitle}>32 Happening Now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @media (max-width: 768px) {
            h1 {
              font-size: 36px !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
