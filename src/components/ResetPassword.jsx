import React from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import authentication from "../appwrite/Auth";
import { getErrorMessage } from "../utility/ErrorMessage.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    if (!userId || !secret) {
      toast.error("Reset link is invalid or expired.");
      return;
    }

    try {
      await authentication.updatePasswordRecovery({
        userId,
        secret,
        password: data.password,
      });

      toast.success("Password updated successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to reset password."));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
          <LockKeyhole size={32} />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium text-gray-600">
            New Password
          </label>

          <input
            type="password"
            placeholder="Enter new password"
            className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <label className="block text-sm font-medium text-gray-600 mt-4">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-5 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Back to{" "}
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