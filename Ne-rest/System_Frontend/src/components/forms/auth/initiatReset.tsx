import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import API_ENDPOINTS from "../../../constants/api";

interface InitiateResetFormProps {
  onInitiateSuccess: (email: string) => void;
}

const InitiateResetForm: React.FC<InitiateResetFormProps> = ({
  onInitiateSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      const response = await axios.put(
        API_ENDPOINTS.auth.resetPasswordInitiate,
        { email: data.email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Reset password email sent successfully");
        onInitiateSuccess(data.email);
      } else {
        toast.error(
          response.data.message || "Failed to send reset password email"
        );
      }
    } catch (error: unknown) {
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg space-y-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 text-black"
    >
      <h2 className="text-3xl font-extrabold text-blue-800 mb-1 text-center">Reset Password</h2>
      <div>
        <label htmlFor="email" className="block mb-2 font-semibold text-blue-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
          className="border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg py-4 px-3 bg-white"
        />
        {errors.email && (
          <p className="text-blue-600 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-lg py-4 transition"
      >
        {isSubmitting ? "Sending..." : "Send Reset Email"}
      </Button>
    </form>
  );
};

export default InitiateResetForm;
