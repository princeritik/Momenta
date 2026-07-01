import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import service from "../appwrite/config";
import PostForm from "../components/FormPost"
import PostCardSkeleton from "../components/PostCardSkeleton";
export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    service.getPost(id).then(setPost);
  }, [id]);

  if (!post) {
    return (
       <div className="space-y-8">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
      </div>
    );
  }

  return <PostForm post={post} />;
}