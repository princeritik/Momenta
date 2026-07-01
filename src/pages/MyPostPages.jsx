import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config.js";
import PostCard from "../components/Card.jsx";
import { Images , WifiOff} from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";
import PostCardSkeleton from "../components/PostCardSkeleton.jsx";
import { toast } from "sonner";
import { getErrorMessage } from "../utility/ErrorMessage.js";

export default function MyPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error , setError] = useState(false);

    const userData = useSelector((state) => state.auth.userData);

    const fetchPosts = async () => {
        if (!userData) return;

        try {
            const response = await appwriteService.getUserPosts(
                userData.$id
            );

            if (response) {
                setPosts(response.documents);
            }
        } catch (err) {
            setError(err)
            toast.error(getErrorMessage(error, "Unable to load posts."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [userData]);

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
        <div className="min-h-screen bg-gray-100 p-6">

            {posts.length === 0 ? (
                <EmptyState
                    icon={<Images size={32} />}
                    title="You haven't posted yet"
                    message="Share your first photo with the world."
                    buttonText="Create Post"
                    buttonLink="/addPost"
                />
            ) : (
                <div className="flex flex-col gap-y-8  max-w-2xl mx-auto">
                    {posts.map((post) => (
                        <PostCard key={post.$id} post={post} setPosts={setPosts} />
                    ))}
                </div>
            )}
        </div>
    );
}