import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); //  show/hide password state
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgetPassword = () => {
    toast.error("Forget password currently not working.", {
      position: "top-center",
      autoClose: 2500,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/login/`,
        formData
      );
      const data = response.data;
      const { token, user } = data;
      const { access, refresh } = token;
      const { username,  id } = user;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("username", username);

      toast.success("Login successful ", {
        position: "top-center",
        autoClose: 2000,
      });

      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.detail || "Invalid credentials ", {
          position: "top-center",
          autoClose: 2500,
        });
      } else {
        toast.error("Network error. Please try again.", {
          position: "top-center",
          autoClose: 2500,
        });
      }
    }
  };


  const navtoReg=()=>{
    navigate('/register');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <ToastContainer />

      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src="image.png"
          alt="bank background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full md:w-1/2 h-screen justify-center items-center bg-linear-to-br from-blue-50 to-blue-100 px-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 relative">
          <h1 className="text-4xl font-bold text-blue-600 text-center mb-8">
            Welcome Back
          </h1>

          <form className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 ml-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2 ml-1.5">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"} //  toggle type
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-4xl focus:ring-2 focus:ring-blue-400 focus:outline-none pr-12"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="absolute right-1/300 top-14 rounded-br-4xl bg-blue-200 rounded-tr-4xl transform -translate-y-1/2 cursor-pointer text-gray-500 border p-3"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={21} /> : <Eye size={24} />}
              </span>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end items-center mb-2">
              <a
                onClick={handleForgetPassword}
                href="#"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-4xl font-semibold hover:bg-blue-700 transition-all duration-200"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Don’t have an account?{" "}
            <button onClick={navtoReg}><a
              href=""
              className="text-blue-600 font-semibold hover:underline"
            >
              Register here
            </a></button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
