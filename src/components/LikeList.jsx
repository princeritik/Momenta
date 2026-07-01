import React from 'react'
import {Link } from "react-router-dom"
import { User } from 'lucide-react';
import UserMiniCard from './UserMiniCard';
import EmptyState from './EmptyState';
import { Heart } from 'lucide-react';

export default function LikesList({ likes,currentUserId }) {
  if (likes.length === 0) {
    return (
      <EmptyState
        icon={<Heart size={32} />}
        title="No likes yet"
        message="Be the first to like this post."
      />
    );
  }

  return (
    <div className="divide-y">
      {likes.map((like) => (
        <div key={like.$id} className="p-4 hover:bg-gray-50 transition">
          <UserMiniCard
            userId={like.userId}
            subtitle="liked this post"
            isMe ={ like.userId === currentUserId}
          />
        </div>
      ))}
    </div>
  );
}
