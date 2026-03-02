import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import CollegeAdminDashboard from "./pages/dashboard/CollegeAdminDashboard";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import AdminProfile from "./pages/profiledit/AdminProfile";
import SuperAdminProfile from "./pages/profiledit/SuperAdminProfile";
import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateEvent from "./pages/event/CreateEvent";
import EditEvent from "./pages/event/EditEvent";
import CollegeEvents from "./pages/event/CollegeEvents";
import ManageRegistrations from "./pages/event/ManageRegistrations";

// Super Admin imports
import PendingColleges from "./pages/superadmin/PendingColleges";
import PendingEvents from "./pages/superadmin/PendingEvents";
import AllColleges from "./pages/superadmin/AllColleges";
import CollegeDetails from "./pages/superadmin/CollegeDetails";
import Analytics from "./pages/superadmin/Analytics";

function App() {
  return (
    <BrowserRouter>
      {/* ✅ FIX: Removed global <Navbar /> from here
          Each page already has its own <Navbar /> inside it.
          Having Navbar in BOTH App.jsx AND each page caused the double header. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Super Admin Routes */}
        <Route
          path="/super-admin/dashboard"
          element={<SuperAdminDashboard />}
        />
        <Route path="/super-admin/profile" element={<SuperAdminProfile />} />
        <Route path="/super-admin/colleges" element={<AllColleges />} />
        <Route path="/super-admin/colleges/:id" element={<CollegeDetails />} />
        <Route
          path="/super-admin/pending-colleges"
          element={<PendingColleges />}
        />
        <Route path="/super-admin/pending-events" element={<PendingEvents />} />
        <Route path="/super-admin/reports" element={<Analytics />} />

        {/* College Admin Routes */}
        <Route path="/admin/profile" element={<AdminProfile />} />

        {/* Specific College Admin Routes FIRST */}
        <Route
          path="/admin/dashboard/create-event"
          element={
            <ProtectedRoute role="college_admin">
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/events"
          element={
            <ProtectedRoute role="college_admin">
              <CollegeEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard/events/:id"
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

        {/* General College Admin Route LAST */}
        <Route path="/admin/dashboard" element={<CollegeAdminDashboard />} />

        {/* 404 Catch All */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
              <div className="text-center p-12">
                <h1 className="text-6xl font-black text-slate-800 mb-4">404</h1>
                <p className="text-2xl text-slate-600 mb-8">Page Not Found</p>
                <a
                  href="/"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl transition-all"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;