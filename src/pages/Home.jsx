import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Images, WifiOff } from "lucide-react";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import PostCardSkeleton from "../components/PostCardSkeleton";
import { getErrorMessage } from "../utility/ErrorMessage";
import { toast } from "sonner";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await appwriteService.getPosts();
    setPosts(response.documents);
  } catch (err) {
    toast.error(getErrorMessage(err, "Unable to load posts."));
    setError(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <PostCardSkeleton />
        <PostCardSkeleton />
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
        onClick={fetchPosts}
      />
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">

      {posts.length === 0 ? (
        <EmptyState
          icon={<Images size={32} />}
          title="No posts yet"
          message="Be the first one to share a moment."
          buttonText="Create Post"
          buttonLink="/add-post"
        />
      ) : (
        <div className="flex flex-col gap-y-8 max-w-2xl mx-auto px-4">
          {posts.map((post) => (
            <Card key={post.$id} post={post} setPosts={setPosts} />
          ))}
        </div>
      )}
    </div>
  );
}