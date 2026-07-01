import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Heart, MessageCircle, Send, Trash2, User, FileQuestion, WifiOff } from "lucide-react";
import LikesList from "../components/LikeList";
import CommentsList from "../components/CommentLIst";
import { toast } from "sonner";
import { timeAgo } from "../utility/TimeFormat";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState.jsx";
import PostCardSkeleton from "../components/PostCardSkeleton.jsx";
import { getErrorMessage } from "../utility/ErrorMessage.js";


import service from "../appwrite/config";

export default function PostDetailPage() {
  const { postId } = useParams();
  const userData = useSelector((state) => state.auth.userData);

  const [post, setPost] = useState(null);
  const [profile, setProfile] = useState(null);

  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [userLike, setUserLike] = useState(null);

  const [activeTab, setActiveTab] = useState("likes");
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deletingComment, setDeletingComment] = useState(false);

  const [error, setError] = useState(false)



  const fetchDetails = async () => {
    try {
      const postData = await service.getPost(postId);

      if (postData) {
        setPost(postData);

        const profileData = await service.getProfile(postData.userId);
        setProfile(profileData);

        const likesData = await service.getLikes(postId);
        setLikes(likesData?.documents || []);

        const commentsData = await service.getComments(postId);
        setComments(commentsData?.documents || []);

        if (userData?.$id) {
          const userLikeData = await service.getUserLike(postId, userData.$id);
          setUserLike(userLikeData?.documents?.[0] || null);
        }
      }
    } catch (err) {
      setError(err)
      console.log("Post detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [postId, userData?.$id]);

  const handleLikeToggle = async () => {
    if (!userData || !post) return;

    if (userLike) { //unlike
      try {
        await service.unlikePost(userLike.$id);

        setLikes((prev) =>
          prev.filter((like) => like.$id !== userLike.$id)
        );

        setUserLike(null);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to unlike post."));
      }
    } else {
      try {
        const newLike = await service.likePost({
          postId: post.$id,
          userId: userData.$id,
        });

        if (newLike) {
          setLikes((prev) => [newLike, ...prev]);
          setUserLike(newLike);
        }
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to like post."));
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim() || !userData || !post) return;

    try {
      const newComment = await service.createComment({
        postId: post.$id,
        userId: userData.$id,
        content: commentText.trim(),
      });

      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");
        setActiveTab("comments");
      }
      toast.success("Comment added");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add comment."));
    }
  };

  const confirmDeleteComment = async () => {
    try {
      setDeletingComment(true);

      await service.deleteComment(commentToDelete);

      setComments((prev) =>
        prev.filter((comment) => comment.$id !== commentToDelete)
      );

      toast.success("Comment deleted");
      setCommentToDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete comment."));
    } finally {
      setDeletingComment(false);
    }
  };
  if (loading) {
    return (
      <div className="space-y-8">
        <PostCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<WifiOff size={32} />}
        title="Unable to connect"
        message="Please check your internet connection and try again."
        buttonText="Retry"
        onClick={fetchDetails}
      />
    );
  }


  if (!post) {
    return (
      <div className="flex items-center justify-center h-[90vh] ">
        <EmptyState
          icon={<FileQuestion size={32} />}
          title="Post not found"
          message="This post may have been deleted or the link is incorrect."
          buttonText="Go Home"
          buttonLink="/"
        />
      </div>
    );
  }

  const imageUrl = service.getFileView(post.imageId);

  const avatarUrl = profile?.avatarId
    ? service.getFileView(profile.avatarId)
    : null;

  const isMe = post.userId === userData.$id

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Post Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b">
          <Link
            to={`/profile/${post.userId}`}
            className="w-11 h-11 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-gray-400" />
            )}
          </Link>

          <div>
            <Link
              to={`/profile/${post.userId}`}
              className="font-semibold text-gray-800 hover:underline"
            >
              {profile?.name || "User"}
              {isMe && (
                <span className="px-2 ml-3 py-0.5 text-[12px] font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                  Me
                </span>
              )}
            </Link>

            <p className="text-xs text-gray-500">
              {timeAgo(post.$createdAt)}
            </p>
          </div>
        </div>

        {/* Image */}
        <img
          src={imageUrl}
          alt={post.caption}
          className="w-full max-h-[650px] object-contain bg-black"
        />

        {/* Caption + Like */}
        <div className="p-5">
          <div className="flex items-center gap-5 mb-4">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-2 font-medium transition ${userLike
                ? "text-red-500"
                : "text-gray-700 hover:text-red-500"
                }`}
            >
              <Heart
                size={26}
                fill={userLike ? "currentColor" : "none"}
              />
              {userLike ? "Liked" : "Like"}
            </button>

            <button
              onClick={() => setActiveTab("comments")}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium"
            >
              <MessageCircle size={26} />
              Comment
            </button>
          </div>

          <p className="text-gray-800">
            <Link
              to={`/profile/${post.userId}`}
              className="font-semibold hover:underline mr-1"
            >
              {profile?.name || "User"}
            </Link>
            {post.caption}
          </p>
        </div>
      </div>

      {/* Comment Input */}
      <form
        onSubmit={handleAddComment}
        className="bg-white mt-5 rounded-2xl shadow-md p-4 flex gap-3"
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          <Send size={20} />
        </button>
      </form>

      {/* Tabs */}
      <div className="grid grid-cols-2 bg-white mt-5 rounded-2xl shadow-md overflow-hidden border">
        <button
          onClick={() => setActiveTab("likes")}
          className={`py-3 font-semibold transition ${activeTab === "likes"
            ? "bg-indigo-600 text-white"
            : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          Likes ({likes.length})
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={`py-3 font-semibold transition ${activeTab === "comments"
            ? "bg-indigo-600 text-white"
            : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          Comments ({comments.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white mt-5 rounded-2xl shadow-md overflow-hidden">
        {activeTab === "likes" ? (
          <LikesList likes={likes} currentUserId={userData?.$id} />
        ) : (
          <CommentsList
            comments={comments}
            currentUserId={userData?.$id}
            onDelete={setCommentToDelete}
          />
        )}
      </div>
      <ConfirmDialog
        open={!!commentToDelete}
        title="Delete comment?"
        message="Your comment will be permanently deleted."
        confirmText="Delete Comment"
        onConfirm={confirmDeleteComment}
        onCancel={() => setCommentToDelete(null)}
        loading={deletingComment}
      />
    </div>
  );
}



