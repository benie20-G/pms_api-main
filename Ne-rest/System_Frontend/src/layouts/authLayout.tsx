import React from "react";
import { Outlet } from "react-router-dom";
import welcome from "../assets/Welcome.jpeg";
const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col max-h-screen md:flex-row">
      <div className="w-full  h-64 md:h-auto">
        <img
          src={welcome}
          alt="Auth"
          className="w-full h-screen object-cover"
        />
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
