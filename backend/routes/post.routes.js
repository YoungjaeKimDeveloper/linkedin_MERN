import exporess from "express";
import { verifyToken } from "../middleware/verifyToken.js";
const router = exporess.Router();
import {
  getFeedPosts,
  createPost,
  deletePost,
  getPostById,
  createComment,
  likePost,
} from "../controllers/post.controller.js";
// 포스터 피드 전체 가져오기 (현재 User + Connection에 저장되어있는 User)
router.get("/", verifyToken, getFeedPosts);
// 포스터 만들어주기 (사진 있을때 + 사진 없을때)
router.post("/create", verifyToken, createPost);
// // 포스터 지워주기
router.delete("/delete/:id", verifyToken, deletePost);
// // 하나의 Post 가져오기
router.get("/:id", verifyToken, getPostById);
// // 코멘트 && 좋아요
router.post("/:id/comment", verifyToken, createComment);
router.post("/:id/like", verifyToken, likePost);

export default router;
