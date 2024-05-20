import User from "../model/User.js";
import Log from "../model/log.js";
import Chat from "../model/chat.js";

export default async (io) => {
  io.on("connection", async (socket) => {
    const chats = await Chat.find();

    for (const chat of chats) {
      const logs = await Log.find({ ChatID: chat._id });

      for (const log of logs) {
        const user = await User.findOne({ _id: log.UserID });

        io.emit(chat._id, {
          uid: user._id,
          avatar: user.avatar,
          username: user.username,
          name: user.name,
          data: log,
        });
      }
    }
  });
};
