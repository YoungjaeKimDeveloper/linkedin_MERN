import express from "express";

const router = express.Router();
import { signup, login, logout } from "../controllers/auth.controller.js";
// 회원가입
router.post("/signup", signup);
// 로그인
router.post("/login", login);
// 로그아웃
router.post("/logout", logout);

export default router;
