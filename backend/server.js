// 외부라이브러리
import express from "express";
import dotenv from "dotenv";
// 내부 라이브러리
import { connectDB } from "./lib/connectDB.js";

dotenv.config({ path: "/Users/youngjaekim/Desktop/linkedin_self/.env" });
const PORT = process.env.PORT;
const app = express();
// Routes 마
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.info(`Server is running in ${PORT} `);
  connectDB();
});
