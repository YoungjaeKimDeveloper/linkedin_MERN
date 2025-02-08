// import cloudinary from "../lib/cloudinary.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../model/notification.js";
import { Post } from "../model/Post.model.js";
import { User } from "../model/User.model.js";

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: [...req.user.connections, req.user._id] },
    })
      // Populate 해서 가져오기
      .populate("author", "name username profilePicture headline ")
      .populate("comments.user", "name username profilePictrue")
      .sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    console.error("ERROR IN [getFeedPosts]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [getFeedPosts]", ${error.message}`,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.user._id;
    let imageURL;
    let newPost;
    // Post에 이미지가 있는경우
    if (image) {
      imageURL = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: userId,
        content: content,
        image: imageURL.secure_url,
      });
    } else {
      newPost = new Post({
        author: userId,
        content: content,
      });
    }
    await newPost.save(); // DB에 저장
    return res.status(201).json({ success: true, message: "POST CREATED ✅" });
    // Post에 이미지가 없는경우
  } catch (error) {
    console.error("ERROR IN [createPost]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [createPost]", ${error.message}`,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    // 지울려고하는 User와 작성자 User 맞는지 확인
    const { id } = req.params;
    const selectedPost = await Post.findById(id);
    if (!selectedPost) {
      return res
        .status(404)
        .json({ success: false, message: "CANNOT FIND THE POST" });
    }
    // 작성자와 Post Author가 같을떄만 delete해주기
    if (req.user._id.toString() !== selectedPost.author.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }
    // 클라우드 에서 사진 지워주기
    if (selectedPost.image) {
      await cloudinary.uploader.destroy(
        selectedPost.image.split("/").pop().split(".")[0]
      );
    }
    // 데이터 베이스에서 지워주기
    await selectedPost.deleteOne({ _id: id });
    return res.status(200).json({ success: true, message: "POST DELETED ✅" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [deletePost]", ${error.message}`,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postID = req.params.id;
    const post = await Post.findById(postID)
      .populate("author", "name username profilePicture")
      .populate("comments.user", "name username profilePicture headline");
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "CANNOT FIND THE POST" });
    }
    return res.status(200).json({ success: true, post: post });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [getPostById]", ${error.message}`,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;
    const currentUser = await User.findById(userId);
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user._id, content: content } },
      },
      { new: true }
    ).populate("author", "name email username headline profilePicture");
    // 각 상황마다 Notification 만들어주기

    if (post.author._id.toString() !== currentUser._id.toString()) {
      const notification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: postId,
      });
      await notification.save();
    }
    return res.status(201).json({ success: true, message: "Comment Created" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [createComment]", ${error.message}`,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    // 포스터에 좋아요 넣어주기
    const post = await Post.findById(postId);
    if (post.likes.includes(userId)) {
      // 싫어요
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }
    // notification
    if (userId.toString() !== post.author.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "like",
        relatedUser: userId,
        relatedPost: postId,
      });
      await newNotification.save();
    }
    await post.save();
    return res.status(201).json({ success: true, message: "LikePost ✅" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [likePost]", ${error.message}`,
    });
  }
};
