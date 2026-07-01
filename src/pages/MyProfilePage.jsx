import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import service from "../appwrite/config";
import ProfilePage from "./ProfilePage";

export default function MyProfilePage() {
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true);
  const [profileUserId, setProfileUserId] = useState(null);

  useEffect(() => {
    if (userData?.$id) {
      setProfileUserId(userData.$id);
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return <ProfilePage userIdFromProp={profileUserId} isOwnProfile={true} />;
}