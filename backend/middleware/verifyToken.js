import jwt from "jsonwebtoken";
import { User } from "../model/User.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "CANNOT FIND THE TOKEN" });
    }
    const decoded = jwt.verify(token, process.env.jwt_secret_key);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Failed to Decoded" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "CANNOT FIND THE USER" });
    }
    // 유저로 내보내주기
    req.user = user;
    // 미들웨어는 항상 next() 로 내보내 주어야함
    next();
  } catch (error) {
    console.error("ERROR IN [verifyToken]", error.message);
    next(error);
  }
};
