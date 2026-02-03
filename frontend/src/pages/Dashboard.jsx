import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/api/logout`,
      );
      if (response.status === 200) {
        navigate("/");
        localStorage.clear();
      }
    } catch (e) {
      console.log(e, "error while logging out");
    }
  };
  return (
    <>
      <button
        className="p-3 bg-red-500 rounded-2xl text-white"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );
};

export default Dashboard;
