import jwt from "jsonwebtoken";
import User from "../model/User.js";
import Chat from "../model/chat.js";
import Log from "../model/log.js";

import library from "../library/function.js";

class ChatController {
  static async removeHTMLTags(str) {
    return str.replace(/<[^>]*>/g, "");
  }

  static async send(req, res) {
    let { chatID, message } = req.body;
    message = message.replace(/<(?!(\/?(p|span|font)))[^>]*>/g, "");

    var message2 = await ChatController.removeHTMLTags(message);

    if (!message2.trim()) {
      return res.status(401).json({
        code: 401,
        message: "Nội dung không được bỏ trống",
      });
    }

    if (!chatID) {
      return res.status(401).json({
        code: 401,
        message: "ID nhóm chat không được bỏ trống",
      });
    }
    const user = await User.findOne({ _id: req.user._id });

    const check = user.friend.find(
      (friend) => friend.chatID.toString() === chatID.toString()
    );
    const check2 = await Chat.findOne({ _id: chatID });

    if (!check) {
      return res.status(401).json({
        code: 401,
        message: "Hộp chat không tồn tại",
      });
    } else if (!check2) {
      return res.status(401).json({
        code: 401,
        message: "Hộp chat không tồn tại",
      });
    } else {
      var log = new Log();
      log.ChatID = chatID;
      log.UserID = req.user._id;
      log.messages.content = message;
      log.save();

      return res.status(200).json({
        code: 200,
        message: "Gửi tin nhắn thành công",
        ChatID:chatID
      });
    }
  }

  static async get(req, res) {
    const { uid, chatID } = req.body;

    if (!uid) {
      return res.status(401).json({
        code: 401,
        message: "ID người dùng không được bỏ trống",
      });
    }

    if (!chatID) {
      return res.status(401).json({
        code: 401,
        message: "ID nhóm chat không được bỏ trống",
      });
    }
    const user = await User.findOne({ _id: req.user._id });

    const check = user.friend.find(
      (friend) =>
        friend.uid.toString() === uid.toString() &&
        friend.type === "friend" &&
        friend.chatID.toString() === chatID.toString()
    );
    const check2 = await Chat.findOne({ _id: chatID });

    if (!check) {
      return res.status(401).json({
        code: 401,
        message: "Hộp chat không tồn tại",
      });
    }

    if (!check2) {
      return res.status(401).json({
        code: 401,
        message: "Hộp chat không tồn tại",
      });
    }
    const friendDetails = await User.findOne({ _id: uid });
    const log = await Log.find({ chatID: chatID });

    return res.status(200).json({
      code: 200,
      message: "Lấy thông tin bạn bè thành công",
      data: {
        avatar: friendDetails.avatar,
        email: friendDetails.email,
        phone: friendDetails.phone,
        username: friendDetails.username,
        online: friendDetails.online,
        name: friendDetails.fullname,
        uid: friendDetails._id, // Sửa friend.uid thành friendDetails._id
        type: check.type, // Sử dụng check.type thay vì friend.type
        message: log,
        count: log.length,
        ChatID: chatID, // Sử dụng check.type thay vì friend.type
      },
    });
  }
}

export default ChatController;
