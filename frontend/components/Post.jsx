import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const Post = ({ post }) => {
  // 실제로 useQuery에서 보낸 authUser
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  // 댓글 창 보여주기
  const [showComments, setShowComments] = useState(false);
  // 새로운 댓글
  const [newComments, setNewComments] = useState("");
  // comments (부모에게서 받은거 사용가능)
  const [comments, setComments] = useState(post.comments || []);
  // 실제 작성자인지 확인하기 ✅
  const isOwner = authUser._id === post.authUser._id;
  const isLiked = post.likes.includes(authUser._id);
  return <div>Post</div>;
};

export default Post;
