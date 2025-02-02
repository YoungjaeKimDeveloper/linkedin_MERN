import cloudinary from "../lib/cloudinary.js";
import { User } from "../model/User.model.js";

export const getSuggestions = async (req, res) => {
  // 나중에 창옆에 보여줄거
  try {
    const users = await User.find({
      _id: {
        $ne: req.user_id,
        $nin: req.user.connections,
      },
    })
      .select("name username profilePicture headline ")
      .limit(3);
    return res
      .status(200)
      .json({ success: true, users: users, testing: "Hello" });
  } catch (error) {
    console.error("ERROR IN [getSuggestions]", error.message);
    return res.status(500).json({
      success: false,
      message: `ERROR IN [getSuggestions] ${error.message}`,
    });
  }
};
// 유저 파일 클릭했을때 유저 정보 가져다 주기
export const showProfile = async (req, res) => {
  try {
    const selectedUsername = req.params.username;
    const selectedUser = await User.findOne({
      username: selectedUsername,
    }).select("-password");
    // 유저를 찾지 못한경우
    if (!selectedUser) {
      return res
        .status(404)
        .json({ success: false, message: "CANNOT FIND THE USER'S Profile" });
    }
    return res.status(200).json({ success: true, selectedUser });
  } catch (error) {
    console.error("ERROR IN [showProfile]", error.message);
    return res.status(500).json({
      success: false,
      message: `ERROR IN [showProfile] ${error.message}`,
    });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const allowToChange = [
    "profilePicture",
    "bannerImg",
    "headline",
    "location",
    "about",
    "skills",
    "experience",
  ];
  //   {
  //     "name": "Youngjae",
  //     "age": 20
  //   }
  const newData = {};
  //   const req = { body: { name: "John", email: "john@example.com" } };
  try {
    for (const field of allowToChange) {
      if (req.body[field]) {
        newData[field] = req.body[field];
      }
    }
    // profilePicture
    if (req.body.profilePicture) {
      try {
        const profilePicture = await cloudinary.uploader.upload(
          req.body.profilePicture
        );
        newData.profilePicture = url.secure_url;
      } catch (error) {
        console.error("Failed to change profilePicture", error.message);
      }
    }
    // bannerImg
    if (req.body.bannerImg) {
      try {
        const url = await cloudinary.uploader.upload(req.body.bannerImg);
        newData.bannerImg = url.secure_url;
      } catch (error) {
        console.error("Failed to change bannerImage");
      }
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: newData },
      { new: true }
    ).select("-password");
    return res
      .status(200)
      .json({ success: true, user: user, message: "Profile has been updated" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `FAILED TO UPDATE USER Profile ${error.message}`,
    });
  }
};
