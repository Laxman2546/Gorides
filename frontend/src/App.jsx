import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoRidesLanding from "./pages/GoRidesLanding";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";


// Admin
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

/* ================= USER PROTECT ================= */
const UserProtected = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ================= ADMIN PROTECT ================= */
const AdminProtected = ({ children }) => {
  const admin = localStorage.getItem("adminAuth");

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<GoRidesLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* User Protected (PATH UNCHANGED) */}
      <Route
        path="/dashboard"
        element={
          <UserProtected>
            <Dashboard />
          </UserProtected>
        }
      />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected (PATH UNCHANGED) */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtected>
            <AdminDashboard />
          </AdminProtected>
        }
      />
    </Routes>
  );
};

export default App;
