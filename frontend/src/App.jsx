import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomeScreen from "./pages/HomeScreen";
import GoRidesLanding from "./pages/GoRidesLanding";


const App = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="r" element={<GoRidesLanding/>}/>
      {/* <Route path="h" element={<HomeScreen/>} /> */}
      
      
    </Routes>
  );
};

export default App;
