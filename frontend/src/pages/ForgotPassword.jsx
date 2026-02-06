import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Send OTP
  const sendOtp = async () => {
    if (!form.email) return toast.error("Enter email");

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/api/send-otp`, {
        email: form.email,
      });

      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async () => {
    if (!form.otp) return toast.error("Enter OTP");

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/api/verify-otp`, {
        email: form.email,
        otp: form.otp,
      });

      toast.success("OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset Password
  const changePassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/api/reset-password`,
        {
          email: form.email,
          password: form.newPassword,
        },
      );

      toast.success("Password changed successfully");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <ToastContainer />

      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-lg border">
        <h2 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl mb-4"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-3 rounded-xl"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl mb-4"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-3 rounded-xl"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl mb-3"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl mb-4"
            />
            <button
              onClick={changePassword}
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-3 rounded-xl"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </>
        )}

        <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full text-gray-500"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
