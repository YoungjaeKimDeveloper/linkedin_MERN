import jwt from "jsonwebtoken";

// 토큰을 발행해 주는 함수
export const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.jwt_secret_key, {
      expiresIn: "3d",
    });
    return token;
  } catch (error) {
    console.error("Faeild to create Token", error.message);
    return;
  }
};
