import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import CollegeAdminDashboard from "./pages/CollegeAdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import SuperAdminProfile from "./pages/SuperAdminProfile";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      // ✅ CORRECT - Lowercase "admin" to match LoginPage navigation
      <Route path="/admin/dashboard" element={<CollegeAdminDashboard />} />

      <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/super-admin/profile" element={<SuperAdminProfile />} />

    </Routes>

  );
}

export default App;
