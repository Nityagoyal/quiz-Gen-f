import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get token from query param
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token); // ✅ Changed from "jwt" to "token"
      navigate("/home"); // redirect to homepage
    } else {
      navigate("/"); // fallback to login
    }
  }, [location, navigate]);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;
