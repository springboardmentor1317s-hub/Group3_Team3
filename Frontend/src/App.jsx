import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CollegeAdminDashboard from "./pages/dashboard/CollegeAdminDashboard";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import AdminProfile from "./pages/profiledit/AdminProfile";
import SuperAdminProfile from "./pages/profiledit/SuperAdminProfile";
import Chatbot from "./components/Chatbot"; // ← ADD THIS

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<CollegeAdminDashboard />} />
        <Route
          path="/super-admin/dashboard"
          element={<SuperAdminDashboard />}
        />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/super-admin/profile" element={<SuperAdminProfile />} />
      </Routes>
      <Chatbot /> {/* ← ADD THIS */}
    </>
  );
}

export default App;
