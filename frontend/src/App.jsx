import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoRidesLanding from "./pages/GoRidesLanding";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<GoRidesLanding />} />
      

      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
