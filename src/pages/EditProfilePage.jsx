import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import service from "../appwrite/config";
import ProfileForm from "../components/ProfileForm";
import EmptyState from "../components/EmptyState";
import { UserX } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "../utility/ErrorMessage";

export default function EditProfilePage() {
  const userData = useSelector((state) => state.auth.userData);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData?.$id) return;

      try {
        const profileData = await service.getProfile(userData.$id);
        setProfile(profileData);
      } catch (error) {
        toast.error(getErrorMessage(error, "Unable to load profile."));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData]);

  if (loading) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  if (!profile) {
  return (
    <EmptyState
      icon={<UserX size={32} />}
      title="Profile not found"
      message="We could not find your profile information."
      buttonText="Go Home"
      buttonLink="/"
    />
  );
}

  return <ProfileForm profile={profile} />;
}