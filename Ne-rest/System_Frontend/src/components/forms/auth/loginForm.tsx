import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import API_ENDPOINTS from "../../../constants/api";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
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
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg space-y-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 text-black"
    >
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-1">Login</h2>
        <h1 className="text-base text-gray-600">Enter credentials to access your account</h1>
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-semibold text-blue-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-4 px-3 bg-white"
        />
        {errors.email && (
          <p className="text-blue-600 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <label htmlFor="password" className="block mb-2 font-semibold text-blue-700">
          Password
        </label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          className="border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-4 px-3 pr-12 bg-white"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-10 text-blue-500 hover:text-blue-700"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.password && (
          <p className="text-blue-600 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-lg py-4 transition"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <div className="flex justify-between text-sm text-gray-600">
        <a href="/auth/forgotPassword" className="hover:underline">
          Forgot password?
        </a>
        <a href="/auth/register" className="text-blue-700 hover:underline font-semibold">
          Register here
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
