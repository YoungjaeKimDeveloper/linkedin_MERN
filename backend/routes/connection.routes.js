import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
} from "../controllers/connection.controller.js";
const router = express.Router();

// 요청 보내기
router.post("/request/:id", verifyToken, sendConnectionRequest);
// 요청 거절하기
router.put("/accept/:requestId", verifyToken, acceptConnectionRequest);
// router.put("/reject/:requestId", verifyToken, rejectConnectionRequest);

export default router;
