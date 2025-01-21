import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
const router = express.Router();
// 사용자별로 Notification 불러오기
router.get("/", verifyToken, getUserNotifications);
// 사용자별로 Notification 불러오고 read로 바꿔주기
router.get("/:id/read", verifyToken, markNotificationAsRead);
// id별로 불러오고 notification 지워주기
router.delete("/:id", verifyToken, deleteNotification);

export default router;
