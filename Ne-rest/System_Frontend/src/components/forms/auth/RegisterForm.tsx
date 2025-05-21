import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react";
import API_ENDPOINTS from "../../../constants/api";

// 1. Zod schema for form validation
const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    names: z.string().min(2, { message: "Name must be at least 2 characters" }),
    telephone: z.string().regex(/^\+?[0-9]{9,15}$/, {
      message: "Invalid telephone number",
    }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegisterSuccess?: (email: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  // 2. State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3. React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  // 4. Functions to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // 5. Form submission handler - keeping original functionality
  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      // Send registration data to backend
      const response = await axios.post(API_ENDPOINTS.auth.register, {
        email: data.email,
        names: data.names,
        telephone: data.telephone,
        password: data.password,
      });

      // If registration fails, show error toast
      if (response.status !== 201) {
        toast.error(response.data.message || "Registration failed");
        return;
      }

      // Store token in localStorage if registration is successful
      const result = response.data.data;
      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      toast.success("Registration successful");
      
      // Use callback if provided, otherwise redirect
      if (onRegisterSuccess) {
        onRegisterSuccess(data.email);
      } else {
        window.location.href = "/auth/login";
      }
    } catch (error: unknown) {
      // Show error toast for API or network errors
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  // 6. Render the registration form with styling from the second version
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-2xl space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-blue-800">Create Account</h2>
        <p className="text-gray-500 text-sm">Sign up to get started</p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="names" className="block font-semibold text-gray-700">
          Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <Input
            id="names"
            type="text"
            placeholder="Your full name"
            {...register("names")}
            className="pl-10 py-5 border-gray-300 focus:ring-blue-500"
          />
        </div>
        {errors.names && (
          <p className="text-sm text-red-500">{errors.names.message}</p>
        )}
      </div>

      {/* Email */}
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

      {/* Telephone */}
      <div className="space-y-2">
        <label htmlFor="telephone" className="block font-semibold text-gray-700">
          Telephone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <Input
            id="telephone"
            type="tel"
            placeholder="+1234567890"
            {...register("telephone")}
            className="pl-10 py-5 border-gray-300 focus:ring-blue-500"
          />
        </div>
        {errors.telephone && (
          <p className="text-sm text-red-500">{errors.telephone.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="block font-semibold text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            {...register("password")}
            className="pl-10 pr-10 py-5 border-gray-300 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block font-semibold text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            className="pl-10 pr-10 py-5 border-gray-300 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl transition-all duration-200"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </Button>

      {/* Links */}
      <div className="flex justify-between text-sm text-gray-500">
        <a href="/auth/login" className="hover:text-blue-600 underline">
          Already have an account?
        </a>
        <a href="/" className="hover:text-blue-600 underline">
          Go home
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;