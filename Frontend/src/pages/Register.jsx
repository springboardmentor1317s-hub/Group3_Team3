import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { setToken, setUser } from "../services/auth";
import {
  FaEnvelope,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGraduationCap,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    role: "student",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      // ✅ FIXED: was /auth/signup → correct endpoint is /auth/register
      const res = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        college: formData.college,
        role: formData.role,
        password: formData.password,
      });

      const user = res.data.user;
      const token = res.data.token;

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Account created successfully!");

      // ✅ FIXED: was checking user.accountType → backend returns user.role
      if (user.role === "college_admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "super_admin") {
        navigate("/super-admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  const passwordInputClass =
    "w-full pl-10 pr-10 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-700 px-8 py-10 text-center text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
                <FaGraduationCap />
              </div>
              <h2 className="text-3xl font-bold">Join Campus Hub</h2>
              <p className="text-sm opacity-90 mt-1">
                Connect with your campus community
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      className={inputClass}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      className={inputClass}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* College */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    College Name
                  </label>
                  <div className="relative">
                    <FaGraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input
                      type="text"
                      name="college"
                      className={inputClass}
                      placeholder="Enter your college"
                      value={formData.college}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    name="role"
                    className="w-full px-3.5 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="college_admin">College Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={passwordInputClass}
                      placeholder="Create a password (min 6 chars)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className={passwordInputClass}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-base font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-700 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 mt-2"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="text-center mt-6 text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-500 font-semibold no-underline hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-white/80 mt-6">
            By registering, you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
