import jwt from "jsonwebtoken";
import User from "../model/User.js";
import library from "../library/function.js";
import Chat from "../model/chat.js";

class FriendController {
  static async add(req, res) {
    try {
      const account = req.body.account;

      if (library.empty(account)) {
        return res.status(400).json({
          code: 400,
          message: "Tài khoản kết bạn không được bỏ trống",
        });
      }

      const users1 = await User.findOne({ email: account });
      const users2 = await User.findOne({ username: account });
      const users3 = await User.findOne({ phone: account });
      const check = await User.findOne({ _id: req.user._id });

      let acc = false;
      let user;

      if (users1) {
        acc = true;
        user = users1;
      } else if (users2) {
        acc = true;
        user = users2;
      } else if (users3) {
        acc = true;
        user = users3;
      }

      if (!acc) {
        return res.status(401).json({
          code: 401,
          message: "Tài khoản không tồn tại",
        });
      }

      const isAlreadyFriend = check.friend.some(
        (friend) => friend.uid.toString() === user._id.toString()
      );
      const isAlreadyFriend2 = user.friend.some(
        (friend) => friend.uid.toString() === check._id.toString()
      );

      if (isAlreadyFriend) {
        return res.status(401).json({
          code: 401,
          message: "Bạn đã gửi kết bạn với tài khoản này",
        });
      } else if (isAlreadyFriend2) {
        return res.status(401).json({
          code: 401,
          message: "Bạn đã gửi lời mời kết bạn với tài khoản này",
        });
      } else if (req.user._id == user._id) {
        return res.status(401).json({
          code: 401,
          message: "Không thể kết bạn chính mình",
        });
      } else {
        check.friend.push({
          avatar: user.avatar,
          name: user.fullname,
          uid: user._id,
          type: "wait",
        });

        user.friend.push({
          avatar: check.avatar,
          name: check.fullname,
          uid: check._id,
          type: "pending",
        });

        await user.save();
        await check.save();

        return res.status(200).json({
          code: 200,
          message:
            "Gửi yêu cầu kết bạn thành công vui lòng chờ đối phương chấp nhận",
          href: "/",
        });
      }
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: "Có lỗi gì xảy ra",
        errorlog: error,
      });
    }
  }
  static async getFriend(req, res) {
    try {
      const user = await User.findOne({ _id: req.user._id });

      if (!user) {
        return res.status(404).json({
          code: 404,
          message: "Người dùng không tồn tại",
        });
      }

      const friends = user.friend.filter((friend) => friend.type === "friend");
      const list = await Promise.all(
        friends.map(async (data) => {
          const check = await User.findOne({ _id: data.uid });

          return {
            avatar: data.avatar,
            email: check.email,
            phone: check.phone,
            username: check.username,
            online: check.online,
            name: data.name,
            uid: data.uid,
            type: data.type,
            chatID: data.chatID,
          };
        })
      );

      return res.status(200).json({
        message: "Lấy danh sách bạn bè thành công",
        data: list,
        count: friends.length,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: "Có lỗi gì xảy ra",
        errorlog: error,
      });
    }
  }
  static async getInvitation(req, res) {
    try {
      const user = await User.findOne({ _id: req.user._id });

      if (!user) {
        return res.status(404).json({
          code: 404,
          message: "Người dùng không tồn tại",
        });
      }

      const friends = user.friend.filter((friend) => friend.type === "pending");
      const list = await Promise.all(
        friends.map(async (data) => {
          const check = await User.findOne({ _id: data.uid });

          return {
            avatar: data.avatar,
            email: check.email,
            phone: check.phone,
            username: check.username,
            online: check.online,
            name: data.name,
            uid: data.uid,
            type: data.type,
          };
        })
      );

      return res.status(200).json({
        message: "Lấy danh sách lời mời kết bạn thành công",
        data: list,
        count: friends.length,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: "Có lỗi gì xảy ra",
        errorlog: error,
      });
    }
  }
  static async status(req, res) {
    try {
      const { uid, type } = req.body;

      const user = await User.findOne({ _id: uid });
      const user2 = await User.findOne({ _id: req.user._id });

      if (!user || !user2) {
        return res.status(401).json({
          code: 401,
          message: "Tài khoản không tồn tại",
        });
      }

      const pendingFriendIndex = user.friend.findIndex(
        (friend) =>
          friend.uid.toString() === req.user._id.toString() &&
          friend.type === "wait"
      );
      const check = user2.friend.findIndex(
        (friend) =>
          friend.uid.toString() === uid.toString() && friend.type === "pending"
      );

      if (pendingFriendIndex !== -1) {
        if (type === "agree") {
          const chat = new Chat({
            status: "public",
          });

          await chat.save();

          user.friend[pendingFriendIndex].type = "friend";
          user.friend[pendingFriendIndex].chatID = chat._id;

          user2.friend[check].type = "friend";
          user2.friend[check].chatID = chat._id;

          await user.save();
          await user2.save();

          return res.status(200).json({
            code: 200,
            message: "Đã chấp nhận lời mời kết bạn",
            href: "/",
          });
        } else if (type === "cancel") {
          user.friend.splice(pendingFriendIndex, 1);
          user2.friend.splice(check, 1);
          await user.save();
          await user2.save();

          return res.status(200).json({
            code: 200,
            message: "Đã từ chối lời mời kết bạn",
            href: "/",
          });
        } else {
          return res.status(401).json({
            code: 401,
            message: "Hành động không hợp lệ",
            href: "/",
          });
        }
      } else {
        return res.status(404).json({
          code: 404,
          message: "Không có lời mời kết bạn nào đang chờ xác nhận",
        });
      }
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: "Có lỗi gì xảy ra",
        errorlog: error,
      });
    }
  }
}

export default FriendController;
