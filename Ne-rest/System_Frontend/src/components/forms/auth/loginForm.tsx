import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { EyeIcon, EyeOff, Lock, Mail } from "lucide-react";
import API_ENDPOINTS from "../../../constants/api";


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({ resolver: zodResolver(loginSchema) });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await axios.post(API_ENDPOINTS.auth.login, data);
      if (response.status !== 200) {
        toast.error(response.data.message || "Login failed");
        return;
      }

      const result = response.data;
      if (result.data.token) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
      }

      toast.success("Login successful");
      onLoginSuccess();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-2xl space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-blue-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm">Login to access your dashboard</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block font-semibold text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="pl-10 py-5 border-gray-300 focus:ring-blue-500"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block font-semibold text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
            className="pl-10 pr-10 py-5 border-gray-300 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl transition-all duration-200"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <div className="flex justify-between text-sm text-gray-500">
        <a href="/auth/forgotPassword" className="hover:text-blue-600 underline">
          Forgot password?
        </a>
        <a href="/auth/register" className="hover:text-blue-600 underline">
          Create an account
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
