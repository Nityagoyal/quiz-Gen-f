import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AuthSuccess from "./components/AuthSuccess"; // new component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth-success" element={<AuthSuccess />} /> {/* NEW ROUTE */}
      </Routes>
    </Router>
  );
};

export default App;
