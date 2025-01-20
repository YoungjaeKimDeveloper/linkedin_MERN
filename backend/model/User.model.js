import mongoose from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bannerImg: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "Linkedin User",
    },
    location: {
      type: String,
      default: "Earth",
    },
    about: {
      type: String,
      default: "",
    },
    skills: {
      // 요롷게 String type array 만들어주기
      type: [String],
    },
    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        fieldOfStudy: String,
        startYear: Date,
        endYear: Date,
      },
    ],
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  // 현재 문서 참조하기
  const user = this;
  // 비밀번호가 수정안된거면 다음으로 넘기기
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 매칭해주기
// 비밀번호 Asyn로 설정되었기 때문에 await로 불러주기
UserSchema.methods.matchPassword = async function (password) {
  try {
    // 현재 유저와 받아본 비밀번호 매칭
    const user = this;
    const matching = await bcrypt.compare(password, user.password);
    return matching;
  } catch (error) {
    console.error("Failed to matchPassword", error.message);
  }
};

export const User = mongoose.model("User", UserSchema);
