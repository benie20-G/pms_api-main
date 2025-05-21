import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import API_ENDPOINTS from "../../../constants/api";
import { Input } from "../../../components/ui/input";

// 1. Zod schema for form validation
const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    names: z.string().min(1, { message: "Names is required" }),
    telephone: z.string().min(1, { message: "Telephone is required" }),
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
  onRegisterSuccess: (email: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  // 2. State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3. Functions to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  //toggle means to change the state of something
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  //a hook is a special function that lets you "hook into" React features. 
  // For example, useState is a hook that lets you add state to your functional components.
  // 4. React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  // 5. Form submission handler
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
      onRegisterSuccess(data.email); // Callback after success
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

  // 6. Render the registration form
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg space-y-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 text-black"
    >
      {/* Form Title */}
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-1">Register</h2>
        <h1 className="text-base text-gray-600">Enter credentials to create account</h1>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block mb-2 font-medium text-blue-700">
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

      {/* Names Field */}
      <div>
        <label htmlFor="names" className="block mb-2 font-medium text-blue-700">
          Names
        </label>
        <Input
          id="names"
          type="text"
          {...register("names")}
          className="border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-4 px-3 bg-white"
        />
        {errors.names && (
          <p className="text-blue-600 text-xs mt-1">{errors.names.message}</p>
        )}
      </div>

      {/* Telephone Field */}
      <div>
        <label htmlFor="telephone" className="block mb-2 font-medium text-blue-700">
          Telephone
        </label>
        <Input
          id="telephone"
          type="text"
          {...register("telephone")}
          className="border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-4 px-3 bg-white"
        />
        {errors.telephone && (
          <p className="text-blue-600 text-xs mt-1">{errors.telephone.message}</p>
        )}
      </div>

      {/* Password Field with visibility toggle */}
      <div className="relative">
        <label htmlFor="password" className="block mb-2 font-medium text-blue-700">
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

      {/* Confirm Password Field with visibility toggle */}
      <div className="relative">
        <label htmlFor="confirmPassword" className="block mb-2 font-medium text-blue-700">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          {...register("confirmPassword")}
          className="border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-4 px-3 pr-12 bg-white"
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute right-4 top-10 text-blue-500 hover:text-blue-700"
          tabIndex={-1}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.confirmPassword && (
          <p className="text-blue-600 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium rounded-lg py-4 transition"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </Button>

      {/* Link to Login */}
      <p className="text-center text-sm text-black">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-700 hover:underline font-medium">
          Login here
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
