// 외부라이브러리
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
// 내부 라이브러리
import { connectDB } from "./lib/connectDB.js";
// 라우터 셋팅
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import connectionRoutes from "./routes/connection.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
// Configuration
dotenv.config({ path: "/Users/youngjaekim/Desktop/linkedin_self/.env" });
const PORT = process.env.PORT;
const app = express();
// 미들웨어 세팅해주기
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 라우터

app.use("/api/auth", authRoutes); // ✅
app.use("/api/users", userRoutes); // ✅
app.use("/api/posts", postRoutes); // ✅
app.use("/api/notifications", notificationRoutes); // ✅

app.use("/api/connections", connectionRoutes);

// 서버
app.listen(PORT, () => {
  console.info(`Server is running in ${PORT} `);
  connectDB();
});
