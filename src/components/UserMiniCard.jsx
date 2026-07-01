import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User, Trash2 } from "lucide-react";
import service from "../appwrite/config";

export default function UserMiniCard({ userId, subtitle, isMe = false }) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        service.getProfile(userId).then(setProfile);
    }, [userId]);

    const avatarUrl = profile?.avatarId
        ? service.getFileView(profile.avatarId)
        : null;

    return (
        <Link
            to={`/profile/${userId}`}
            className="flex items-center gap-3"
        >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {avatarUrl ? (
                    <img src={avatarUrl} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                    <User size={20} className="text-gray-400" />
                )}
            </div>

            <div>
                <p className="font-semibold text-gray-800">
                    {profile?.name || "User"}
                    {isMe && (
                        <span className="px-2 ml-3 py-0.5 text-[12px] font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                            Me
                        </span>
                    )}
                </p>

                {subtitle && (
                    <p className="text-xs text-gray-500">{subtitle}</p>
                )}
            </div>
        </Link>
    );
}
