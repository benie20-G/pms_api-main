import React from "react";
import { Outlet } from "react-router-dom";
import welcome from "../assets/welcome.png";
import Header from "../components/commons/header";
import Footer from "../components/commons/Footer";

const AuthLayout: React.FC = () => {
  return (
   
      <div
        className="w-full  bg-cover bg-center align-middle"
        style={{ backgroundImage: `url(${welcome})` }}
      >
   <Header/>
    <div
        className="w-full h-64 md:h-screen bg-cover bg-center align-middle flex flex-col justify-center items-center m-[30px]"
      >
  <Outlet />
  </div>
  <Footer/>
      </div>

    
  );
};

export default AuthLayout;
