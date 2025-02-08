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

    if (post.author._id.toString() !== req.user._id.toString()) {
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
