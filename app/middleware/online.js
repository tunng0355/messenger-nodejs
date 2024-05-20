import User from "../model/User.js";
import { escape } from "lodash"; // Import escape function from lodash library

const onlineUsers = {};

export default async (io) => {
  io.on("connection", async (socket) => {
    let userId;
    socket.on("userConnected", async (id) => {
      userId = id;
      onlineUsers[userId] = socket.id;
      await User.findByIdAndUpdate(userId, { online: true });
      io.emit("updateOnlineUsers", await getOnlineUsernames());
    });

    // Heartbeat mechanism to check if the client is still connected
    const heartbeatInterval = setInterval(() => {
      if (!socket.connected) {
        // If the client is not connected, assume disconnection
        handleDisconnect();
      }
    }, 10000); // Check every 10 seconds

    
    socket.on("disconnect", handleDisconnect);

    async function handleDisconnect() {
      clearInterval(heartbeatInterval); // Stop the heartbeat interval
      if (userId) {
        delete onlineUsers[userId];
        await User.findByIdAndUpdate(userId, { online: false });
        io.emit("updateOnlineUsers", await getOnlineUsernames());
      }
    }
  });
};

async function getOnlineUsernames() {
  const onlineUsers = await User.find({ online: true }).select("username");
  // Sanitize usernames to prevent XSS
  return onlineUsers.map((user) => escape(user.username));
}
