import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();
// Controller
import {
  getSuggestions,
  showProfile,
  updateProfile,
} from "../controllers/user.controller.js";
export default router;

// 추천인 보여주기
router.get("/suggestions", verifyToken, getSuggestions);
// 공개 프로퍼일 보여주기 : 어떤 User를 클릭한 상태임
router.get("/:username", verifyToken, showProfile);
// 프로파일 업데이트하기
router.put("/updateProfile", verifyToken, updateProfile);
