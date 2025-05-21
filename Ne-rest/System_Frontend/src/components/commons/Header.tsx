import React from "react";
import { Button } from "../../components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/auth/login";
  const isRegister = location.pathname === "/auth/register";

  return (
    <header className="bg-gradient-to-r from-blue-50 to-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-800">ParkIt</h1>
        <nav className="flex space-x-4">
          <Link to="/auth/login">
            <Button
              className={`${
                isLogin
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-blue-600 hover:text-blue-800"
              } rounded-xl px-6`}
              variant={isLogin ? "default" : "ghost"}
            >
              Login
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button
              className={`${
                isRegister
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-blue-600 hover:text-blue-800"
              } rounded-xl px-6`}
              variant={isRegister ? "default" : "ghost"}
            >
              Sign Up
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
