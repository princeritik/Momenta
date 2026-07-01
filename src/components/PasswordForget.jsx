import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import authentication from "../appwrite/Auth";
import { getErrorMessage } from "../utility/ErrorMessage";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await authentication.createPasswordRecovery(data.email);

      toast.success("Password reset link sent to your email.");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to send reset password email.")
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
          <Mail size={32} />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password?
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}