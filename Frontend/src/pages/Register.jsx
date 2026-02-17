import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { setToken } from "../services/auth";
import {
  FaEnvelope,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
} from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    college: "",
    accountType: "Student",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/signup", {
        fullName: formData.fullName,
        email: formData.email,
        college: formData.college,
        accountType: formData.accountType,
        password: formData.password,
      });

      const user = res.data.user;
      const token = res.data.token;

      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.accountType);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Account created successfully!");

      if (user.accountType === "College Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
    wrapper: { width: "100%", maxWidth: "480px" },
    card: {
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      overflow: "hidden",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 32px",
      textAlign: "center",
      color: "white",
    },
    iconCircle: {
      width: "70px",
      height: "70px",
      background: "rgba(255,255,255,0.2)",
      backdropFilter: "blur(10px)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 20px",
      fontSize: "32px",
    },
    headerTitle: { fontSize: "28px", fontWeight: "700", margin: 0 },
    headerSubtitle: { fontSize: "15px", opacity: "0.9", margin: 0 },
    formContainer: { padding: "32px" },
    formGroup: { marginBottom: "20px" },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "8px",
    },
    inputWrapper: { position: "relative" },
    icon: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      fontSize: "14px",
      pointerEvents: "none",
    },
    input: {
      width: "100%",
      padding: "12px 14px 12px 40px",
      fontSize: "15px",
      border: "2px solid #e5e7eb",
      borderRadius: "10px",
      outline: "none",
      transition: "all 0.2s",
      fontFamily: "inherit",
    },
    inputFocus: {
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
    select: {
      width: "100%",
      padding: "12px 14px",
      fontSize: "15px",
      border: "2px solid #e5e7eb",
      borderRadius: "10px",
      outline: "none",
      transition: "all 0.2s",
      backgroundColor: "white",
      fontFamily: "inherit",
    },
    passwordInput: {
      width: "100%",
      padding: "12px 40px 12px 40px",
      fontSize: "15px",
      border: "2px solid #e5e7eb",
      borderRadius: "10px",
      outline: "none",
      transition: "all 0.2s",
      fontFamily: "inherit",
    },
    eyeIcon: {
      position: "absolute",
      right: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      cursor: "pointer",
      fontSize: "16px",
    },
    button: {
      width: "100%",
      padding: "14px",
      fontSize: "16px",
      fontWeight: "700",
      color: "white",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
      marginTop: "8px",
    },
    signInText: {
      textAlign: "center",
      marginTop: "24px",
      fontSize: "14px",
      color: "#6b7280",
    },
    link: { color: "#667eea", fontWeight: "600", textDecoration: "none" },
    footer: {
      textAlign: "center",
      fontSize: "13px",
      color: "rgba(255,255,255,0.8)",
      marginTop: "24px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.iconCircle}>
              <FaGraduationCap />
            </div>
            <h2 style={styles.headerTitle}>Join Campus Hub</h2>
            <p style={styles.headerSubtitle}>
              Connect with your campus community
            </p>
          </div>
          <div style={styles.formContainer}>
            <form onSubmit={handleRegister}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <FaUser style={styles.icon} />
                  <input
                    type="text"
                    name="fullName"
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <FaEnvelope style={styles.icon} />
                  <input
                    type="email"
                    name="email"
                    style={styles.input}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>College Name</label>
                <div style={styles.inputWrapper}>
                  <FaGraduationCap style={styles.icon} />
                  <input
                    type="text"
                    name="college"
                    style={styles.input}
                    placeholder="Enter your college"
                    value={formData.college}
                    onChange={handleChange}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Account Type</label>
                <select
                  name="accountType"
                  style={styles.select}
                  value={formData.accountType}
                  onChange={handleChange}
                  onFocus={(e) =>
                    Object.assign(e.target.style, styles.inputFocus)
                  }
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  required
                >
                  <option value="Student">Student</option>
                  <option value="College Admin">College Admin</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <FaLock style={styles.icon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    style={styles.passwordInput}
                    placeholder="Create a password (min 6 chars)"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    required
                  />
                  <span
                    style={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <FaLock style={styles.icon} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    style={styles.passwordInput}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.inputFocus)
                    }
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    required
                  />
                  <span
                    style={styles.eyeIcon}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                style={styles.button}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 20px rgba(102, 126, 234, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(102, 126, 234, 0.4)";
                }}
              >
                Create Account
              </button>
            </form>

            <p style={styles.signInText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.link}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
        <p style={styles.footer}>
          By registering, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default Register;
