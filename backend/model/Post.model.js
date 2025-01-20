import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  // 좋아요 / 코멘트
  commnets: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  likes: [{ type: mongoose.Schema.Types.ObjectId }],
});

export const Post = mongoose.model("Post", PostSchema);
