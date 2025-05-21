import Footer from "../../components/commons/Footer";
import Header from "../../components/commons/header";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>

      <Header />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white/80 rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Parking Management System</h1>
        <p className="mb-8 text-gray-700">
          Effortlessly manage your parking spaces, vehicles, and users. Secure, fast, and easy to use.
        </p>
        <div className="flex flex-col gap-4">
          <button
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => navigate("/auth/register")}
          >
            Get Started
          </button>
        </div>
      </div>

    </div>
    <Footer/>
    </div>
  );
};

export default HomePage;