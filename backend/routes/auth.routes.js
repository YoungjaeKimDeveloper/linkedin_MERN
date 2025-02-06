import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../controllers/auth.controller.js";

// 회원가입
router.post("/signup", signup);
// 로그인
router.post("/login", login);
// 로그아웃
router.post("/logout", logout);
// 최근 유저
router.get("/check-auth", verifyToken, checkAuth);

export default router;
