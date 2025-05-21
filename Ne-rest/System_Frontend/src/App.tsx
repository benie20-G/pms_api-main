import React, { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthLayout from "./layouts/authLayout";
import DashboardLayout from "./layouts/dashboardLayout";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import DashboardPage from "./pages/dashboard";
import ForgotPasswordPage from "./pages/auth/forgotPassword";
import ResetPasswordPage from "./pages/auth/resetPassword";
import NotFoundPage from "./pages/404";
import UnauthorizedPage from "./pages/404/unauthorized";
import UserPage from "./pages/users";
import HomePage from "./pages/home/home";
import ParkingPage from "./pages/parking";
import CarRecordsPage from "./pages/car-records";
import DriverDashboard from "./pages/dashboard/driverDash";

const PrivateRoute: React.FC<{
  children: ReactElement;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If no allowedRoles specified, allow all authenticated users
  if (!allowedRoles) {
    return children;
  }

  try {
    const parsedUser = JSON.parse(user);
    const UserRole = parsedUser.role;

    if (allowedRoles.includes(UserRole)) {
      return children;
    } else {
      return <Navigate to="/dashboard/unauthorized" replace />;
    }
  } catch {
    return <Navigate to="/auth/login" replace />;
  }
};

const PublicRoute: React.FC<{ children: ReactElement }> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />

        {/* Auth routes */}
        <Route
          path="/auth/*"
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="resetPassword" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
        <Route index element={<DashboardPage />} />
          <Route
            path="users"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <UserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="parking"
            element={
              <PrivateRoute allowedRoles={["ADMIN", "PARKING_ATTENDANT"]}>
                <ParkingPage />
              </PrivateRoute>
            }
          />
            <Route
              path="car-records"
              element={
                <PrivateRoute allowedRoles={["ADMIN", "PARKING_ATTENDANT"]}>
                  <CarRecordsPage />
                </PrivateRoute>
              }
            />
          <Route
            path="driver-dashboard"
            element={
              <PrivateRoute allowedRoles={["PARKING_ATTENDANT"]}>
                <DriverDashboard />
              </PrivateRoute>
            }
          />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
