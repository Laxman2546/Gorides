import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("Enter admin credentials");
      return;
    }

    // TEMP AUTH (replace with backend)
    if (email === "admin@gorides.com" && password === "admin123") {
      localStorage.setItem("adminAuth", true);
      toast.success("Admin Logged In");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid admin login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-3">
        <h2 className="text-xl font-bold text-center">Admin Login</h2>

        <input
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
