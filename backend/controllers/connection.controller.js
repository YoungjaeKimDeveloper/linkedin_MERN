import ConnectionRequest from "../model/connectionRequest.js";
import Notification from "../model/notification.js";
import { User } from "../model/User.model.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    // 로그인 유저 - 현재 req.user_id
    // 로그인 받는유저 - selected User
    const recipientID = req.params.id;
    const userID = req.user._id;

    console.log("받는사람아이디: ", recipientID);
    console.log("현재 로그인한 유저 아이디", userID);

    if (recipientID.toString() === userID.toString()) {
      return res.status(401).json({
        success: false,
        message: "YOU CANNOT SEND REQUEST TO YOURSELF",
      });
    }

    const currentUser = await User.findById(userID);

    if (currentUser.connections.includes(recipientID)) {
      return res.status(401).json({
        success: false,
        message: "The user is already connected ✅",
      });
    }

    const existedRequest = await ConnectionRequest.findOne({
      sender: userID,
      recipient: recipientID,
      status: "pending",
    });

    if (existedRequest) {
      return res.status(401).json({
        success: false,
        message: "Request is pending...",
      });
    }

    // Notification 따로 만들어주기
    const newRequest = new ConnectionRequest({
      sender: userID,
      recipient: recipientID,
      status: "pending",
    });
    console.log("새로 생성된 Request", newRequest);

    await newRequest.save();
    return res
      .status(201)
      .json({ success: true, message: "Request has been sent ✅" });
  } catch (error) {
    console.error("ERROR IN [sendConnectionRequest]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [sendConnectionRequest]", ${error.message}`,
    });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  console.log("AccepacceptConnectionRequesttcon: 이눌렸습니다");
  const userID = req.user._id;
  const requestId = req.params.requestedId;

  console.log("로그인한 유저 ", userID);
  console.log("요청받은 유저", requestId);
  // connectionRequest 찾아주기
  // ❌ 현재  connectionRequest가 없는상황임
  const connectionRequest = await ConnectionRequest.findById(requestId)
    .populate("sender", "name email username")
    .populate("recipient", "name username");
  console.log("connectionRequest: ", connectionRequest);
  try {
    // 커넥션을 못찾는경우
    if (!connectionRequest) {
      return res
        .status(404)
        .json({ success: false, message: "CANNOT FIND THE REQUEST" });
    }
    // 이미 process 된경우
    if (connectionRequest.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "connection has been processed" });
    }
    // 권한이 없는경우
    if (connectionRequest.recipient._id.toString() !== userID.toString()) {
      return res.status(401).json({
        success: false,
        message: "NO AUTHORITY to accpet the Request",
      });
    }
    connectionRequest.status = "accepted";
    await connectionRequest.save();

    // 각각에 connection에 추가해주기;
    // 현재 로그인 한 유저
    await User.findByIdAndUpdate(
      { _id: userID },
      { $addToSet: { connections: requestId } },
      { new: true }
    );
    // 요청 받은 유저
    await User.findByIdAndUpdate(
      { _id: requestId },
      { $addToSet: { connections: userID } },
      { new: true }
    );
    // notification 만들어주기
    const notification = new Notification({
      recipient: requestId,
      type: "connectionAccepted",
      relatedUser: userID,
    });
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Request Accepted✅",
      acceptConnectionRequest,
    });
  } catch (error) {
    console.error("ERROR IN [acceptConnectionRequest]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [acceptConnectionRequest]", ${error.message}`,
    });
  }
};
// connection 요청 온거 거절하기
export const rejectConnectionRequest = async (req, res) => {
  try {
    const requestedId = req.params.requestedId;
    const userId = req.user._id;
    // 보낸 Request 찾아주기
    const connectionRequest = await ConnectionRequest.findOne({
      recipient: requestedId,
      status: "pending",
    });
    // 현재 유저와 Request ID 가 맞지않을떄
    if (connectionRequest.recipient.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "No Authority" });
    }
    if (connectionRequest.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "connection has been processed" });
    }
    connectionRequest.status = "rejected";
    await connectionRequest.save();
    return res
      .status(200)
      .json({ success: true, message: "Connection Request has been rejected" });
  } catch (error) {
    console.error("ERROR IN [rejectConnectionRequest]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [rejectConnectionRequest]", ${error.message}`,
    });
  }
};
// 요청온거 전체 확인하기
export const getAllconnectionsRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const connectionRequests = await ConnectionRequest.find({
      _id: userId,
      status: "pending",
    }).populate("sender", "name username profilePicture headline connections");
    return res.status(200).json({ success: true, connectionRequests });
  } catch (error) {
    console.error("ERROR IN [getAllconnectionsRequests]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [getAllconnectionsRequests]", ${error.message}`,
    });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate(
      "connections",
      "name username profilePicture headline"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "CANNOT FIND THE USER" });
    }
    return res
      .status(200)
      .json({ success: true, connections: user.connections });
  } catch (error) {
    console.error("ERROR IN [getUserConnections]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [getUserConnections]", ${error.message}`,
    });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserID = req.params.userId;
    // 각자 connection 에서 제거 해주기
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { connections: targetUserID },
    });
    await User.findByIdAndUpdate(targetUserID, {
      $pull: { connections: currentUserId },
    });
    return res.status(200).json({ success: true, message: "User removed" });
  } catch (error) {
    console.error("ERROR IN [removeConnection]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [removeConnection]", ${error.message}`,
    });
  }
};
// 여기에서
// 현재 에러가 나오고있는 부분
export const getConnectionStatus = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserID = req.params.userId;

    const currentUser = await User.findById(currentUserId);

    if (currentUser.connections.includes(targetUserID)) {
      return res.status(200).json({ success: true, status: "connected" });
    }
    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: currentUserId, recipient: targetUserID },
        { sender: targetUserID, recipient: currentUserId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.status(200).json({ success: true, status: "pending" });
      } else {
        return res.json({ status: "received", requestId: pendingRequest._id });
      }
    }

    return res.json({ status: "not_connected" });
  } catch (error) {
    console.error("ERROR IN [getConnectionStatus]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [getConnectionStatus]", ${error.message}`,
    });
  }
};
