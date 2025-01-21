import ConnectionRequest from "../model/connectionRequest.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    // 유저 찾아서 request 보내주기
    const recipientID = req.params.id;
    const userID = req.user._id;
    if (recipientID.toString() === userID.toString()) {
      return res.status(401).json({
        success: false,
        message: "YOU CANNOT SEND REQUEST TO YOURSELF",
      });
    }
    if (req.user.connections.includes(recipientID)) {
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
    const newRequest = new ConnectionRequest({
      sender: userID,
      recipient: recipientID,
      status: "pending",
    });

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
// 여기에서 부터
export const acceptConnectionRequest = async (req, res) => {
  try {
    const recipientID = req.params.id;
    const userID = req.user._id;
    if (userID !== recipientID) {
      return res
        .status(401)
        .json({ success: false, message: "YOU DON'T HAVE AN AUTHORITY" });
    }
    const requestedConnection = await ConnectionRequest.findOne({
      recipient: userID,
      status: "pending",
    });
    if (!requestedConnection) {
      return res
        .status(404)
        .json({ success: false, message: "CANNOT FIND THE REQUEST" });
    }
    requestedConnection.status = "accepted";
    await requestedConnection.save();
    return res.status(200).json({
      success: true,
      message: "Request accepted ✅",
    });
  } catch (error) {
    console.error("ERROR IN [acceptConnectionRequest]", error.message);
    return res.status(500).json({
      success: false,
      message: `"ERROR IN [acceptConnectionRequest]", ${error.message}`,
    });
  }
};
