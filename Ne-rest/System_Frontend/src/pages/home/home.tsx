import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white/80 rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Parking Management System</h1>
        <p className="mb-8 text-gray-700">
          Effortlessly manage your parking spaces, vehicles, and users. Secure, fast, and easy to use.
        </p>
        <div className="flex flex-col gap-4">
          <button
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => navigate("/auth/login")}
          >
            Login
          </button>
          <button
            className="w-full py-2 px-4 bg-white border border-blue-600 text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition"
            onClick={() => navigate("/auth/register")}
          >
            Sign Up
          </button>
        </div>
      </div>
      <footer className="mt-10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Parking Management System
      </footer>
    </div>
  );
};

export default HomePage;