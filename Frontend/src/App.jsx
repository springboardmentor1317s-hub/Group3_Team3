import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CollegeAdminDashboard from "./pages/dashboard/CollegeAdminDashboard";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import AdminProfile from "./pages/profiledit/AdminProfile";
import SuperAdminProfile from "./pages/profiledit/SuperAdminProfile";
import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute"
import CreateEvent from "./pages/event/CreateEvent"
import EditEvent from "./pages/event/EditEvent"
import ManageRegistrations from "./pages/event/ManageRegistrations"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

         {/* ---------- Student Admin Routes ---------- */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />

         {/* ---------- Super Admin Routes ---------- */}
        <Route
          path="/super-admin/dashboard"
          element={<SuperAdminDashboard />}
        />
        <Route path="/super-admin/profile" element={<SuperAdminProfile />} />

          

        {/* ---------- College Admin Routes ---------- */}
        <Route path="/admin/dashboard" element={<CollegeAdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route
          path="/admin/dashboard/create-event"
          element={
            <ProtectedRoute role="college_admin">
              <CreateEvent />
            </ProtectedRoute> 
          }
        />
        <Route
          path="/admin/dashboard/events/:id/edit"
          element={
            <ProtectedRoute role="college_admin">
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/events/:eventId/registrations"
          element={
            <ProtectedRoute role="college_admin">
              <ManageRegistrations />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Chatbot />
    </> 
  );
}

export default App;
