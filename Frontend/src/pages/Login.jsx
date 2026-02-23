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
import Navbar from "../components/Navbar";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
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
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");

      if (user.accountType === "Super Admin") {
        navigate("/super-admin/dashboard");
      } else if (user.accountType === "College Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
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
    switch (formData.role) {
      case "super_admin":
        return <FaUserShield />;
      case "college_admin":
        return <FaUniversity />;
      default:
        return <FaUserGraduate />;
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const passwordInputClass =
    "w-full pl-10 pr-10 py-3 text-sm border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-5">
        <div className="w-full max-w-112.5">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-br from-indigo-500 to-purple-700 px-8 py-10 text-center text-white">
              <div className="w-17.5 h-17.5 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
                <FaUserShield />
              </div>
              <h2 className="text-3xl font-bold m-0">Welcome Back</h2>
              <p className="text-sm opacity-90 mt-1">
                Sign in to your Campus Hub account
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-5">
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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-base"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white transition-all duration-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                    <div className="px-3.5 text-gray-400 text-base flex items-center justify-center border-r-2 border-gray-200 self-stretch">
                      {getAccountIcon()}
                    </div>
                    <select
                      name="role"
                      className="w-full px-3.5 py-3 text-sm border-none outline-none bg-transparent cursor-pointer rounded-r-xl"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="college_admin">College Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right -mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-500 font-semibold no-underline hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 text-base font-bold text-white bg-linear-to-br from-indigo-500 to-purple-700 border-none rounded-xl cursor-pointer transition-all duration-300 shadow-lg shadow-indigo-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-400 mt-2"
                >
                  Sign In
                </button>
              </form>

              <p className="text-center mt-6 text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-500 font-semibold no-underline hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-white/80 mt-6">
            Secure login powered by Campus Hub
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;