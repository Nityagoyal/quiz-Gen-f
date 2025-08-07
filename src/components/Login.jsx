// src/components/Login.jsx
import React from 'react';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8976/auth/google'; // backend endpoint
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Quantum Coin Flip</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
