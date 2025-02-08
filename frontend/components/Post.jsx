import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import {
  Loader,
  MessageCircle,
  Share2,
  ThumbsUp,
  Trash2,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PostAction from "./PostAction";
// 시간 포멧해주는 함수
import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatRelative,
  subDays,
} from "date-fns";

const Post = ({ post }) => {
  const queryClient = useQueryClient();
  // 실제로 useQuery에서 보낸 authUser
  // 항상 Key 값으로 Caching해서 빠르게 체크하기
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  console.log("확인된 유저", authUser);
  // 댓글 창 보여주기
  const [showComments, setShowComments] = useState(false);
  // 기존에 생성되어있던 comments를 의미함.
  const [comments, setComments] = useState(post?.comments || []);
  // 새로운 댓글
  const [newComment, setNewComment] = useState("");

  // 실제 작성자인지 확인하기 ✅
  const isOwner = authUser._id === post.authUser?._id;
  // 현재 User가 클릭했으면 Blue로 바꿔주기
  // 현재 로그인한 User의 ID가 Like에 들어가있으면 블루로 바꿔주기
  const isLiked = post.likes.includes(authUser?.user._id);
  // 포스트 지워주기
  const { mutate: deletePost, isPending: isDeleteLoading } = useMutation({
    // mutationKey: ["posts"],
    mutationFn: async () => {
      console.log(`/posts/delete/${post._id}`);
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      console.log("Post has been deleted");
      toast.success("Post Delete Successfully✅");
      // 항상 Posts 업데이트 해주기
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      console.log("Failed to delete Post", err);
      toast.error("Failed to delete Post", err?.response?.data?.message);
    },
  });
  const handleDeletePost = () => {
    deletePost();
  };
  // 새로운 코멘트 달기
  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      // Query 최신 상태로 업데이틓 해주기
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("comment Created Successfully ✅");
    },
    onError: (error) => {
      console.error("Error in [createComment]", error?.response?.data?.message);
      toast.error("Error in [createComment]", error?.response?.data?.message);
    },
  });
  // 좋아요 눌러주기
  // Focus
  const { mutate: likePosts, isPending: isLikeLoading } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      toast.success("Like ❤️");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Failed to like the post", error?.message);
      toast.error(
        "Failed to update like the post",
        error?.response?.data?.message
      );
    },
  });
  const handleLikePost = async () => {
    // if we are liking we don't send another liking
    if (isLikeLoading) return;
    likePosts();
  };
  // 새로운 코멘트 만들어주기
  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser.user._id,
            name: authUser.user.name,
            profilePicture: authUser.user.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };
  console.log(post, "포스트에 들어있는 정보");
  return (
    // 전체 포스팅 div태그로 감싸주기
    <div className="bg-gray-300 rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile/${post?.author.username}`}>
              <img
                src={post?.author?.profilePicture || "../public/avatar.png"}
                alt={post?.author?.name}
                className="size-10 rounded-full mr-3"
              />
            </Link>
            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold">{post.author.name}</h3>
              </Link>
              <p className="text-xs text-info">{post.author?.headline}</p>
              {/* 시간 데이터 포멧 */}
              {formatDistanceToNow(new Date(post?.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              {isDeleteLoading ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4"
          />
        )}
        <div className="flex justify-between text-info">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500 fill-blue-300" : ""}
              />
            }
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />
          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction icon={<Share2 size={18} />} text="Share" />
        </div>
        {/* From HERE */}
        {showComments && (
          <div className="px-4 pb-4">
            <div className="mb-4 max-h-60 overflow-y-auto">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="mb-2 bg-base-100 p-2 rounded flex items-start"
                >
                  <img
                    src={comment.user.profilePicture || "/avatar.png"}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold mr-2">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-info">
                        {formatDistanceToNow(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* 새로운 코멘트 작성하기 */}
            <form onSubmit={handleAddComment} className="flex items-center">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="submit"
                className="bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300"
                disabled={isAddingComment}
              >
                {isAddingComment ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
