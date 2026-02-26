import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ✅ FIX: Removed <BrowserRouter> from here
// BrowserRouter is already inside App.jsx — having it in BOTH places
// causes "You cannot render a <Router> inside another <Router>" crash

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
