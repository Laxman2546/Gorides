import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Car } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    emailid: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/api/login`,
        formData,
        { withCredentials: true },
      );
      const data = response.data;
      localStorage.setItem(
        "user",
        JSON.stringify({ name: data.username, email: data.emailid }),
      );

      toast.success("Login successful ", {
        position: "top-center",
        autoClose: 2000,
      });

      navigate("/dashboard");
    } catch (error) {
      console.log(error.response);
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
    } finally {
      setLoading(false);
    }
  };

  const navtoReg = () => {
    navigate("/register");
  };

  const navtoLogin = () => {
    navigate("/login");
  };

  const NavtoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <header className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={NavtoHome} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
              <Car className="text-white" size={22} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Go<span className="text-emerald-500">Rides</span>
            </h1>
          </button>
          <div className="flex gap-3">
            <button
              onClick={navtoLogin}
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

      <div className="flex flex-col md:flex-row pt-20 min-h-screen justify-center">
        <div className="flex w-full md:w-1/2 justify-center items-center px-6 py-12 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-lg rounded-3xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-500">
                  Sign in to continue your journey
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    name="emailid"
                    value={formData.emailid}
                    onChange={handleChange}
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
                      placeholder="Enter your password"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-12"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgetPassword}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-500 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {loading ? "Signing In..." : "  Sign In"}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    New to GoRides?
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={navtoReg}
                className="w-full border-2 border-emerald-500 text-emerald-600 py-3.5 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-200"
              >
                Create an Account
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
              By signing in, you agree to our{" "}
              <a
                target="_blank"
                href="https://www.termsfeed.com/live/938b07fe-145f-471d-8418-9ce9c4210b3b"
                className="text-emerald-600 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                target="_blank"
                href="https://www.termsfeed.com/live/3dd25c5e-f031-4755-8b2d-47b7a8b3bfbb"
                className="text-emerald-600 hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
