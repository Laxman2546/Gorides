import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, Loader2, Car } from "lucide-react";
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
        emailid: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/api/register`,
        payload,
        { withCredentials: true },
      );

      localStorage.setItem(
        "user",
        JSON.stringify({ name: response.data.username, email: formData.email }),
      );

      toast.success("User registered successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/dashboard");
    } catch (error) {
      console.log(error.response);
      toast.error(
        error.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const navtoLog = () => navigate("/login");
  const navtoReg = () => navigate("/register");
  const navtoHome = () => navigate("/");

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={navtoHome} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
              <Car className="text-white" size={22} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Go<span className="text-emerald-500">Rides</span>
            </h1>
          </button>
          <div className="flex gap-3">
            <button
              onClick={navtoLog}
              className="px-6 py-2.5 rounded-xl border-2 border-emerald-500 text-emerald-600 font-semibold hover:bg-emerald-50 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={navtoReg}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row pt-20 min-h-calc(100vh-100px) items-start justify-center">
        <div className="flex w-full md:w-1/2 justify-center items-center px-6 py-2 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-100">
              <div className="text-center mb-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h1>
                <p className="text-gray-500">
                  Join GoRides and start sharing rides
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleRegister}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={togglePassword}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 ml-1">
                    Must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={toggleConfirm}
                    >
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={navtoLog}
                className="w-full border-2 border-emerald-500 text-emerald-600 py-3.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-200"
              >
                Sign In Instead
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
