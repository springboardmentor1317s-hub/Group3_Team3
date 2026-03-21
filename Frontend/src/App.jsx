import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/event/EventDetails"; // ✅ FIXED: was ./pages/EventDetails

// Student
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StudentNotifications from "./pages/dashboard/StudentNotifications";
import StudentProfile from "./pages/profiledit/StudentProfile";
import StudentEvents from "./pages/studentevents/StudentEvents";
import MyRegistrations from "./pages/studentevents/MyRegistrations";

// College Admin
import CollegeAdminDashboard from "./pages/dashboard/CollegeAdminDashboard";
import AdminProfile from "./pages/profiledit/AdminProfile";
import CreateEvent from "./pages/event/CreateEvent";
import EditEvent from "./pages/event/EditEvent";
import CollegeEvents from "./pages/event/CollegeEvents";
import ManageRegistrations from "./pages/event/ManageRegistrations";
import CollegeEventDetails from "./pages/event/CollegeEventDetails";

// Super Admin
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import SuperAdminProfile from "./pages/profiledit/SuperAdminProfile";
import PendingColleges from "./pages/superadmin/PendingColleges";
import PendingEvents from "./pages/superadmin/Pendingevents";
import AllColleges from "./pages/superadmin/AllColleges";
import CollegeDetails from "./pages/superadmin/CollegeDetails";
import Analytics from "./pages/superadmin/Analytics";
import AllEvents from "./pages/superadmin/AllEvents";

// Feedback
import EventFeedback from "./pages/student/EventFeedback";
import FeedbackAnalytics from "./pages/admin/FeedbackAnalytics";

import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* ── Student ───────────────────────────────────────────────────── */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/events" element={
          <ProtectedRoute role="student"><StudentEvents /></ProtectedRoute>
        } />
        <Route path="/student/registrations" element={
          <ProtectedRoute role="student"><MyRegistrations /></ProtectedRoute>
        } />
        <Route path="/student/notifications" element={
          <ProtectedRoute role="student"><StudentNotifications /></ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>
        } />
        <Route path="/student/feedback/:eventId" element={
          <ProtectedRoute role="student"><EventFeedback /></ProtectedRoute>
        } />

        {/* ── College Admin ─────────────────────────────────────────────── */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="college_admin"><CollegeAdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute role="college_admin"><AdminProfile /></ProtectedRoute>
        } />
        <Route path="/admin/dashboard/create-event" element={
          <ProtectedRoute role="college_admin"><CreateEvent /></ProtectedRoute>
        } />
        <Route path="/admin/dashboard/events" element={
          <ProtectedRoute role="college_admin"><CollegeEvents /></ProtectedRoute>
        } />
        <Route path="/admin/dashboard/eventsDetails/:id" element={
          <ProtectedRoute role="college_admin"><CollegeEventDetails /></ProtectedRoute>
        } />
        <Route path="/admin/dashboard/events/:id" element={
          <ProtectedRoute role="college_admin"><EditEvent /></ProtectedRoute>
        } />
        <Route path="/admin/dashboard/events/:eventId/registrations" element={
          <ProtectedRoute role="college_admin"><ManageRegistrations /></ProtectedRoute>
        } />
        <Route path="/admin/feedback-analytics" element={
          <ProtectedRoute role="college_admin"><FeedbackAnalytics /></ProtectedRoute>
        } />

        {/* ── Super Admin ───────────────────────────────────────────────── */}
        <Route path="/super-admin/dashboard" element={
          <ProtectedRoute role="super_admin"><SuperAdminDashboard /></ProtectedRoute>
        } />
        <Route path="/super-admin/profile" element={
          <ProtectedRoute role="super_admin"><SuperAdminProfile /></ProtectedRoute>
        } />
        <Route path="/super-admin/colleges" element={
          <ProtectedRoute role="super_admin"><AllColleges /></ProtectedRoute>
        } />
        <Route path="/super-admin/colleges/:id" element={
          <ProtectedRoute role="super_admin"><CollegeDetails /></ProtectedRoute>
        } />
        <Route path="/super-admin/pending-colleges" element={
          <ProtectedRoute role="super_admin"><PendingColleges /></ProtectedRoute>
        } />
        <Route path="/super-admin/pending-events" element={
          <ProtectedRoute role="super_admin"><PendingEvents /></ProtectedRoute>
        } />
        <Route path="/super-admin/reports" element={
          <ProtectedRoute role="super_admin"><Analytics /></ProtectedRoute>
        } />
        <Route path="/super-admin/all-events" element={
          <ProtectedRoute role="super_admin"><AllEvents /></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center p-12">
              <h1 className="text-8xl font-black text-slate-200 mb-4">404</h1>
              <p className="text-2xl font-bold text-slate-600 mb-8">Page Not Found</p>
              <Link to="/" className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all inline-block">
                Go Home
              </Link>
            </div>
          </div>
        } />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;