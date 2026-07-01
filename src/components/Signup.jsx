import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Camera } from "lucide-react";
import { useDispatch } from "react-redux";

import authentication from "../appwrite/Auth";
import service from "../appwrite/config";
import { login } from "../store/authSlice";
import { toast } from "sonner";
import { getErrorMessage } from "../utility/ErrorMessage";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const session = await authentication.createAccount({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      if (session) {
        const userData = await authentication.getCurrentUser()

        if (userData) {
          let avatarFile = null;

          if (data.avatar && data.avatar[0]) {
            avatarFile = await service.uploadFile(data.avatar[0]);
          }

          await service.createProfile({
            userId: userData.$id,
            name: userData.name,
            email: userData.email,
            avatarId: avatarFile?.$id || "",
            bio: "",
          });
          await authentication.sendVerificationEmail();

          dispatch(login(userData));
          toast.success("Account created! Verification email sent.");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create account."));
    }
  };

  const avatarRegister = register("avatar");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-2">
            <label
              htmlFor="avatar"
              className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-indigo-500 transition"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="text-gray-400" size={32} />
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                Upload
              </div>
            </label>

            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              {...avatarRegister}
              onChange={(e) => {
                avatarRegister.onChange(e);
                handleAvatarChange(e);
              }}
            />

            <p className="text-sm text-gray-500 mt-2">
              Add profile photo
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}