import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getAllconnectionsRequests,
  getUserConnections,
  removeConnection,
  getConnectionStatus,
} from "../controllers/connection.controller.js";
const router = express.Router();

// 요청 보내기
router.post("/request/:id", verifyToken, sendConnectionRequest);

// 요청 거절하기 [put]
router.put("/reject/:requestedId", verifyToken, rejectConnectionRequest);
// 요청 받은거 전체 가져오기
router.get("/requests", verifyToken, getAllconnectionsRequests);
// 유저의 connection 전체 가져오기
router.get("/", verifyToken, getUserConnections);
router.delete("/:userId", verifyToken, removeConnection);
router.get("/status/:userId", verifyToken, getConnectionStatus);
// ❌ Fix
// 요청 승인하기 [put]
router.put("/accept/:requestedId", verifyToken, acceptConnectionRequest);

export default router;
