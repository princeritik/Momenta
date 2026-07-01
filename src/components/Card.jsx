import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ConfirmDialog from "./ConfirmDialog";
import { getErrorMessage } from "../utility/ErrorMessage";
import {
  Heart,
  MessageCircle,
  Send,
  Trash2,
  Pencil,
  User,
} from "lucide-react";

import service from "../appwrite/config";
import { toast } from "sonner";
import { timeAgo } from "../utility/TimeFormat";

export default function PostCard({ post, setPosts }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [profile, setProfile] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [userLike, setUserLike] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isOwner = post.userId === userData?.$id;
  const imageUrl = service.getFileView(post.imageId);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCardData = async () => {
      const profileData = await service.getProfile(post.userId);
      setProfile(profileData);

      const likesData = await service.getLikes(post.$id);
      setLikes(likesData?.documents || []);

      const commentsData = await service.getComments(post.$id);
      setComments(commentsData?.documents || []);

      if (userData?.$id) {
        const userLikeData = await service.getUserLike(
          post.$id,
          userData.$id
        );
        setUserLike(userLikeData?.documents?.[0] || null);
      }
    };

    fetchCardData();
  }, [post.$id, post.userId, userData?.$id]);

  const avatarUrl = profile?.avatarId
    ? service.getFileView(profile.avatarId)
    : null;

  const isMe = post.userId === userData.$id

  const handleLikeToggle = async () => {
    try {
      if (!userData) return;

      if (userLike) {
        await service.unlikePost(userLike.$id);

        setLikes((prev) =>
          prev.filter((like) => like.$id !== userLike.$id)
        );

        setUserLike(null);
      } else {
        const newLike = await service.likePost({
          postId: post.$id,
          userId: userData.$id,
        });

        if (newLike) {
          setLikes((prev) => [newLike, ...prev]);
          setUserLike(newLike);
        }
      }
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      const newComment = await service.createComment({
        postId: post.$id,
        userId: userData.$id,
        content: commentText.trim(),
      });

      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
        setShowCommentInput(false);
      }
      toast.success("Comment added");

    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const deleted = await service.deletePost(post.$id);

      if (deleted) {
        setPosts((prev) =>
          prev.filter((p) => p.$id !== post.$id)
        );
        toast.success("Post deleted successfully");
      }

      setConfirmOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete post."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-md mx-auto border border-gray-100 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          to={`/profile/${post.userId}`}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-gray-400" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 leading-tight">
              {profile?.name || "User"}
              {isMe && (
                <span className="px-2 ml-3 py-0.5 text-[12px] font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                  Me
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500">
              {timeAgo(post.$createdAt)}
            </p>
          </div>
        </Link>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/editPost/${post.$id}`)}
              className="p-2 rounded-lg text-blue-500 hover:bg-blue-50"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={() => setConfirmOpen(true)}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <img
        loading="lazy"
        src={imageUrl}
        alt={post.caption}
        onClick={() => navigate(`/post/${post.$id}`)}
        className="w-full h-72 object-cover cursor-pointer"
      />

      {/* Body */}
      <div className="p-4">
        {/* Actions */}
        <div className="flex items-center gap-5 mb-3">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1 font-medium ${userLike ? "text-red-500" : "text-gray-700 hover:text-red-500"
              }`}
          >
            <Heart size={24} fill={userLike ? "currentColor" : "none"} />
            <span>{likes.length}</span>
          </button>

          <button
            onClick={() => setShowCommentInput((prev) => !prev)}
            className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 font-medium"
          >
            <MessageCircle size={24} />
            <span>{comments.length}</span>
          </button>
        </div>

        {/* Caption */}
        <p className="text-gray-800">

          {post.caption}
        </p>

        {/* View details */}
        <button
          onClick={() => navigate(`/post/${post.$id}`)}
          className="text-sm text-gray-500 hover:text-indigo-600 mt-2"
        >
          View details
        </button>

        {/* Small comment input */}
        {showCommentInput && (
          <form
            onSubmit={handleAddComment}
            className="flex items-center gap-2 mt-4 border-t pt-3"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700"
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
      {/* delete pop */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete post?"
        message="This post and its image will be permanently deleted. This action cannot be undone."
        confirmText="Delete Post"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  );
}