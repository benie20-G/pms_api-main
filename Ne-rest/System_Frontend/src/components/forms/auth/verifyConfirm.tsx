import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import API_ENDPOINTS from "../../../constants/api";

// Props: expects user's email and a callback for successful verification
interface VerifyConfirmFormProps {
  email: string;
  onVerifySuccess: () => void;
}

const VerifyConfirmForm: React.FC<VerifyConfirmFormProps> = ({
  email,
  onVerifySuccess,
}) => {
  // State to hold each digit of the 6-digit code
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  // Refs to manage focus for each input
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Handle input change for each digit
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only one digit per box
    setCode(newCode);
    // Move to next input if not last
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace to move focus to previous input
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle form submission for verification
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }
    try {
      // Send code and email to backend for verification
      const url = API_ENDPOINTS.auth.verifyAccountConfirm(verificationCode);
      const response = await axios.put(
        url,
        { email },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Email verified successfully");
        onVerifySuccess(); // Callback on success
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      // Show error toast for API or network errors
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg space-y-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 text-black"
    >
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-blue-800 mb-1 text-center">
        Verify Email
      </h2>
      {/* 6-digit code input fields */}
      <div className="flex justify-between space-x-2 mb-2">
        {code.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            ref={(el: HTMLInputElement | null) => {
              inputsRef.current[idx] = el;
            }}
            className="w-14 h-14 text-center text-2xl border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg bg-white"
          />
        ))}
      </div>
      {/* Buttons: Verify and Resend */}
      <div className="w-full flex gap-4 justify-between items-center">
        <Button
          type="submit"
          className="w-1/2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-lg py-4 transition"
        >
          Verify Email
        </Button>
        <Button
          type="button"
          className="w-1/2 border border-blue-400 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg py-4 transition"
          variant="outline"
          // Resend code handler
          onClick={async () => {
            try {
              await axios.put(
                API_ENDPOINTS.auth.verifyAccountInitiate,
                {
                  email,
                },
                {
                  headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              toast.success("Verification code resent");
            } catch {
              toast.error("Failed to resend code");
            }
          }}
        >
          Resend Code
        </Button>
      </div>
    </form>
  );
};

export default VerifyConfirmForm;
