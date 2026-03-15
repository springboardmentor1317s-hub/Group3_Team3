// src/pages/student/RegisterEvents.jsx
// ✅ FIXED: was fully fake with hardcoded array + alert()
// Now redirects to the real /events page which is connected to the backend

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterEvents = () => {
  const navigate = useNavigate();

  // This page is no longer used — redirect to the real events page
  useEffect(() => {
    navigate("/events", { replace: true });
  }, []);

  return null;
};

export default RegisterEvents;