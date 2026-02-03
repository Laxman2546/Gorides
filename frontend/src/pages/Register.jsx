import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      toast.error("Enter a valid email");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/register/`,
        payload
      );

      const { token, user } = response.data;
      const { access, refresh } = token;
      const { username } = user;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("username", username);

      toast.success("User registered successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const navtoLog = () => navigate("/");

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <ToastContainer />

      {/* Left Side */}
      <div className="flex w-full md:w-1/2 h-screen justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
            Create Account
          </h1>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Username */}
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1 ml-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-1 ml-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold text-sm mb-1 ml-1.5">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm pr-10"
                required
              />
              <span
                className="absolute right-1 top-11 transform -translate-y-1/2 border p-2 rounded-r-xl bg-blue-100 cursor-pointer"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold text-sm mb-1 ml-1.5">
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm pr-10"
                required
              />
              <span
                className="absolute right-1 top-11 transform -translate-y-1/2 border p-2 rounded-r-xl bg-blue-100 cursor-pointer"
                onClick={toggleConfirm}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4 text-sm">
            Already have an account?{" "}
            <button
              onClick={navtoLog}
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src="image.png"
          alt="Gorides-register"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;
