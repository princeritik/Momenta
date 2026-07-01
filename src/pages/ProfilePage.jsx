import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import service from "../appwrite/config";
import PostCard from "../components/Card.jsx";
import { User, Pencil, UserX , WifiOff} from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";
import { Images } from "lucide-react";
import PostCardSkeleton from "../components/PostCardSkeleton.jsx";
import { toast } from "sonner";
import { getErrorMessage } from "../utility/ErrorMessage.js";


export default function ProfilePage({ userIdFromProp = null, isOwnProfile = false }) {
  const params = useParams();
  const userId = userIdFromProp || params.userId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false)
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    try {
      const profileData = await service.getProfile(userId);
      const userPosts = await service.getUserPosts(userId);

      setProfile(profileData);
      setPosts(userPosts?.documents || []);
    } catch (err) {
      setError(err)
       toast.error(getErrorMessage(error, "Unable to load profile."));
    } finally {
      setLoading(false);
    }
  }; 
  

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

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
            onClick={fetchProfileData}
        />
        );
    }

  if (!profile) {
  return (
    <div className="flex items-center justify-center h-[90vh] ">
       <EmptyState
        icon={<UserX size={32} />}
        title="Profile not found"
        message="This user profile does not exist or may have been removed."
        buttonText="Go Home"
        buttonLink="/"
      />
     </div>
  );
}
  const avatarUrl = profile.avatarId
    ? service.getFileView(profile.avatarId)
    : null;

  return (
    <div className="max-w-3xl mx-auto">
     {/* Profile Header */}
<div className="bg-white rounded-2xl shadow-md p-6 mb-8">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={48} className="text-gray-400" />
        )}
      </div>

      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-800">
          {profile.name}
        </h1>

        <p className="text-gray-500 mt-1">
          {profile.email}
        </p>

        {profile.bio && (
          <p className="text-gray-700 mt-3">
            {profile.bio}
          </p>
        )}

        <p className="text-sm text-gray-500 mt-3">
          {posts.length} Posts
        </p>
      </div>
    </div>

    {isOwnProfile && (
      <button
        onClick={() => navigate("/editProfile")}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md"
      >
        <Pencil size={18} />
        Edit Profile
      </button>
    )}
  </div>
</div>

      {/* User Posts */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Posts
      </h2>

      {posts.length === 0 ? (
        <EmptyState
          icon={<Images size={32} />}
          title= {isOwnProfile?"You haven't posted yet" : "No posts yet" }
          message= {isOwnProfile? "Share your first photo with the world.": "This user has not shared any posts."}
          buttonText= {isOwnProfile?  "Create Post": ""}
          buttonLink= {isOwnProfile? "/addPost": ""}
        />
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.$id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}