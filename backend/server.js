// 외부라이브러리
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// 내부 라이브러리
import { connectDB } from "./lib/connectDB.js";
// 라우터
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config({ path: "/Users/youngjaekim/Desktop/linkedin_self/.env" });
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.listen(PORT, () => {
  console.info(`Server is running in ${PORT} `);
  connectDB();
});
