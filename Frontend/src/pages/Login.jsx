import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { setToken } from "../services/auth";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaUniversity,
  FaUserGraduate,
} from "react-icons/fa";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    accountType: "Student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signin", {
        email: formData.email,
        password: formData.password,
      });

      const user = res.data.user;
      const token = res.data.token;

      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.accountType);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");

      if (user.accountType === "Super Admin") {
        navigate("/superadmin-dashboard");
      } else if (user.accountType === "College Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    }
  };

  const getAccountIcon = () => {
    switch (formData.accountType) {
      case "Super Admin":
        return <FaUserShield />;
      case "College Admin":
        return <FaUniversity />;
      default:
        return <FaUserGraduate />;
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
    wrapper: { width: "100%", maxWidth: "450px" },
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
    selectWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      border: "2px solid #e5e7eb",
      borderRadius: "10px",
      transition: "all 0.2s",
      backgroundColor: "white",
    },
    selectIcon: {
      padding: "0 14px",
      color: "#9ca3af",
      fontSize: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRight: "2px solid #e5e7eb",
    },
    select: {
      width: "100%",
      padding: "12px 14px",
      fontSize: "15px",
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
      fontFamily: "inherit",
      cursor: "pointer",
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
    signUpText: {
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
              <FaUserShield />
            </div>
            <h2 style={styles.headerTitle}>Welcome Back</h2>
            <p style={styles.headerSubtitle}>
              Sign in to your Campus Hub account
            </p>
          </div>
          <div style={styles.formContainer}>
            <form onSubmit={handleLogin}>
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
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                  <FaLock style={styles.icon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    style={styles.passwordInput}
                    placeholder="Enter your password"
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
                <label style={styles.label}>Account Type</label>
                <div
                  style={styles.selectWrapper}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={styles.selectIcon}>{getAccountIcon()}</div>
                  <select
                    name="accountType"
                    style={styles.select}
                    value={formData.accountType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Student">Student</option>
                    <option value="College Admin">College Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ textAlign: "right", marginBottom: "16px" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: "13px",
                    color: "#667eea",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Forgot Password?
                </Link>
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
                Sign In
              </button>
            </form>

            <p style={styles.signUpText}>
              Don't have an account?{" "}
              <Link to="/register" style={styles.link}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
        <p style={styles.footer}>Secure login powered by Campus Hub</p>
      </div>
    </div>
  );
}

export default Login;
