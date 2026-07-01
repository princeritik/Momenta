import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Camera, Save, User } from "lucide-react";
import { toast } from "sonner";

import service from "../appwrite/config";

export default function ProfileForm({ profile }) {
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState(
    profile?.avatarId ? service.getFileView(profile.avatarId) : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: profile?.name || "",
      bio: profile?.bio || "",
    },
  });

  const avatarRegister = register("avatar");

  const handleAvatarChange = (e) => {
    avatarRegister.onChange(e);

    const file = e.target.files?.[0];

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const submit = async (data) => {
    try {
      let avatarId = profile.avatarId || "";

      if (data.avatar && data.avatar[0]) {
        const newAvatar = await service.uploadFile(data.avatar[0]);

        if (newAvatar) {
          if (profile.avatarId) {
            await service.deleteFile(profile.avatarId);
          }

          avatarId = newAvatar.$id;
        }
      }

      await service.updateProfile(profile.$id, {
        name: data.name,
        bio: data.bio,
        avatarId,
      });

      navigate("/profile");
      toast.success("Profile updated");
    } catch (error) {
        toast.error("Failed to update profile");
      console.log("Update profile error:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div className="flex flex-col items-center">
            <label
              htmlFor="avatar"
              className="relative w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-indigo-500 transition"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-gray-400" size={42} />
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1 flex items-center justify-center gap-1">
                <Camera size={13} />
                Change
              </div>
            </label>

            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              {...avatarRegister}
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Bio
            </label>

            <textarea
              rows={4}
              placeholder="Write something about yourself..."
              className="w-full border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("bio")}
            />

            <p className="text-xs text-gray-400 mt-1">
              Optional
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Save size={20} />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}