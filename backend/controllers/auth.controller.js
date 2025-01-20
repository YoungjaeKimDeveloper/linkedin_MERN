import { User } from "../model/User.model.js";
import { generateToken } from "../utils/generateToken.js";

// 회원가입 기능
export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Fill up the all forms" });
    }
    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ success: false, message: "Email Existed" });
    }
    const existedUsername = await User.findOne({ username });
    if (existedUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username is existed" });
    }
    const newUser = new User({ name, username, email, password });
    await newUser.save();
    const token = generateToken(newUser._id);
    res.cookie("jwt", token, {
      httpOnly: true, // prevent XSS attack
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict", // prevent CSRF attacks,
      secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle at
    });
    return res.status(201).json({
      success: true,
      newUser: {
        name,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Failed to signup", error.message);
    return res.status(500).json({
      success: false,
      message: `Server Error in [signup] 4{}`,
    });
  }
};
// 로그인 기능
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 아이디로 찾기
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "INVALID ACCESS" });
    }
    // 비밀번호 매칭
    const isMatchingPassword = await user.matchPassword(password);
    if (!isMatchingPassword) {
      return res
        .status(401)
        .json({ success: false, message: "INVALID ACCESS" });
    }
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true, // prevent XSS attack
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict", // prevent CSRF attacks,
      secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle at
    });
    return res.status(200).json({
      success: true,
      user: {
        ...user.toObject(), // user 객체 스프레드
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error in [login] ${error.message}`,
    });
  }
};
// 로그아웃 기능
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ success: true, message: "LoggedOut ✅" });
  } catch (error) {
    console.error("ERROR in [logout] ${error.message}");
    return res
      .status(500)
      .json({ success: false, message: `ERROR IN [logout] ${error.message}` });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = req.user;
    console.info(user);
    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `ERROR IN checkAuth ${error.message}` });
  }
};
