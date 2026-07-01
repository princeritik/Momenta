import React from 'react'
import {Link } from "react-router-dom"
import { User } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import UserMiniCard from './UserMiniCard';
import { timeAgo } from '../utility/TimeFormat';
import EmptyState from './EmptyState';
import { MessageCircle } from 'lucide-react';

export default function CommentsList({ comments, currentUserId, onDelete }) {
  if (comments.length === 0) {
    return (
     <EmptyState
      icon={<MessageCircle size={32} />}
      title="No comments yet"
      message="Start the conversation by adding a comment."
      />
    );
  }

  return (
    <div className="divide-y">
      {comments.map((comment) => {
        const isOwner = comment.userId === currentUserId;

        return (
          <div key={comment.$id} className="p-4 hover:bg-gray-50 transition">
            <div className="flex items-start justify-between gap-3">
              <UserMiniCard
                userId={comment.userId}
                subtitle={timeAgo(comment.$createdAt)}
                isMe = {isOwner}
              />

              {isOwner && (
                <button
                  onClick={() => onDelete(comment.$id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="ml-13 mt-3 bg-gray-50 rounded-2xl px-4 py-3 text-gray-700">
              {comment.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
