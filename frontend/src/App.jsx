import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeScreen from "./pages/HomeScreen";
import GoRidesLanding from "./pages/GoRidesLanding";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/r" element={<GoRidesLanding />} />
      
      
    </Routes>
  );
};

export default App;
