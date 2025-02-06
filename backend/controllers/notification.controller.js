import Notification from "../model/notification.js";

export const getUserNotifications = async (req, res) => {
  // Find할때 populate해서 찾아주기
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image");
    return res
      .status(200)
      .json({ success: true, notifications: notifications });
  } catch (error) {
    console.error("ERROR IN [getUserNotifications]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [getUserNotifications]", ${error.message}`,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const userID = req.user._id;
    const notificationID = req.params.id;
    const updatedNotification = await Notification.findByIdAndUpdate(
      {
        _id: notificationID,
        recipient: userID,
      },
      { read: true },
      { new: true }
    );
    return res.status(200).json({ success: true, updatedNotification });
  } catch (error) {
    console.error("ERROR IN [markNotificationAsRead]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [markNotificationAsRead]", ${error.message}`,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationID = req.params.id;
    const userID = req.user._id;
    const deletedNotification = await Notification.findByIdAndDelete({
      _id: notificationID,
      recipient: userID,
    });
    return res.status(200).json({ success: true, deletedNotification });
  } catch (error) {
    console.error("ERROR IN [deleteNotification]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [deleteNotification]", ${error.message}`,
    });
  }
};
