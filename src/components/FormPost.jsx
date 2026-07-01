import React, { useEffect, useState } from "react";
import { ImagePlus, Send, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getErrorMessage } from "../utility/ErrorMessage";

import service from "../appwrite/config";

export default function FormPost({ post = null }) {
  const [imagePreview, setImagePreview] = useState(
    post?.imageId ? service.getFileView(post.imageId) : null
  );

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      caption: "",
    },
  });

  useEffect(() => {
    if (post) {
      reset({
        caption: post.caption,
      });

      if (post.imageId) {
        setImagePreview(service.getFileView(post.imageId));
      }
    }
  }, [post, reset]);

  const imageRegister = register("image", {
    required: post ? false : "Image is required",
  });

  const handleImageChange = (e) => {
    imageRegister.onChange(e);

    const file = e.target.files?.[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submit = async (data) => {
    try {
      if (post) {
        await service.updatePost(post.$id, {
          caption: data.caption,
        });
      } else {
        const file = await service.uploadFile(data.image[0]);

        if (!file) {
          throw new Error("Image upload failed");
        }

        await service.createPost({
          userId: userData.$id,
          caption: data.caption,
          imageId: file.$id,
        });
      }
      toast.success(post ? "Post updated" : "Post created");

      reset();
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save post."));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {post ? <Pencil size={24} /> : <ImagePlus size={26} />}
            {post ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {post
              ? "Update your caption and save changes."
              : "Share a photo with a short caption."}
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="p-6 space-y-5">
          {/* Image Preview */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Image
            </label>

            <label
              htmlFor="image"
              className="group relative block w-full h-80 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden cursor-pointer hover:border-indigo-500 transition"
            >
              {imagePreview ? (
                <img
                  loading="lazy"
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <ImagePlus size={48} />
                  <p className="mt-3 font-medium">Click to upload image</p>
                  <p className="text-sm">PNG, JPG, JPEG</p>
                </div>
              )}

              {!post && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition">
                  <span className="opacity-0 group-hover:opacity-100 text-white bg-black/60 px-4 py-2 rounded-xl text-sm">
                    Choose image
                  </span>
                </div>
              )}
            </label>

            {!post && (
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                {...imageRegister}
                onChange={handleImageChange}
              />
            )}

            {errors.image && (
              <p className="text-red-500 text-sm mt-2">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Caption
            </label>

            <textarea
              {...register("caption", {
                required: "Caption is required",
              })}
              rows={5}
              className="w-full border border-gray-300 rounded-2xl p-4 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write something about your post..."
            />

            {errors.caption && (
              <p className="text-red-500 text-sm mt-2">
                {errors.caption.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Send size={20} />
            {isSubmitting
              ? post
                ? "Updating..."
                : "Creating..."
              : post
                ? "Update Post"
                : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}