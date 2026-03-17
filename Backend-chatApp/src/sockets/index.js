const User = require("../models/user.model");
const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
const mongoose = require("mongoose");

const activeUsers = new Map();

function initializeSocket(io) {
  io.on("connection", (socket) => {

    // =============================
    // USER ONLINE
    // =============================
    socket.on("join", async (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) return;

      socket.userId = userId;

      const count = (activeUsers.get(userId) || 0) + 1;
      activeUsers.set(userId, count);

      if (count === 1) {
        await User.findByIdAndUpdate(userId, { online: true });
      }

      io.emit("onlineUsers", Array.from(activeUsers.keys()));
    });

    // =============================
    // JOIN CONVERSATION ROOM
    // =============================
    socket.on("joinConversation", (conversationId) => {
      if (!mongoose.Types.ObjectId.isValid(conversationId)) return;
      socket.join(conversationId);
    });

    // =============================
    // TYPING
    // =============================
      socket.on("typing", ({ conversationId, userId }) => {
        console.log("Typing event received:", conversationId, userId)

        socket.to(conversationId).emit("typing", {
          conversationId,
          userId
        });
      });

      socket.on("stopTyping", ({ conversationId, userId }) => {
        socket.to(conversationId).emit("stopTyping", {
          conversationId,
          userId
        });
      });

    // =============================
    // REALTIME MESSAGE
    // =============================
    socket.on("sendMessage", (msg) => {
      io.to(msg.conversation.toString()).emit("newMessage", msg);
    });

    // =============================
    // MESSAGE DELIVERED
    // =============================
    socket.on("messageDelivered", async ({ messageId }) => {
      const msg = await Message.findByIdAndUpdate(
        messageId,
        { status: "delivered" },
        { new: true }
      );

      if (!msg) return;

      io.to(msg.conversation.toString()).emit("messageStatus", {
        messageId,
        status: "delivered",
      });
    });

    // =============================
    // MESSAGE SEEN (DOUBLE TICK)
    // =============================
    socket.on("messageSeen", async ({ messageId }) => {
      const msg = await Message.findByIdAndUpdate(
        messageId,
        { status: "seen" },
        { new: true }
      );

      if (!msg) return;

      io.to(msg.conversation.toString()).emit("messageStatus", {
        messageId,
        status: "seen",
      });
    });

    // =============================
    // CONVERSATION SEEN (UNREAD RESET)
    // =============================
    socket.on("conversationSeen", async ({ conversationId, userId }) => {
      const convo = await Conversation.findById(conversationId);
      if (!convo) return;

      convo.unreadCount.set(userId, 0);
      await convo.save();

      io.to(conversationId).emit("unreadReset", {
        conversationId,
        userId,
      });
    });

    // =============================
    // DISCONNECT
    // =============================
    socket.on("disconnect", async () => {
      const userId = socket.userId;
      if (!userId) return;

      const count = (activeUsers.get(userId) || 1) - 1;

      if (count <= 0) {
        activeUsers.delete(userId);

        await User.findByIdAndUpdate(userId, {
          online: false,
          lastSeen: new Date(),
        });
      } else {
        activeUsers.set(userId, count);
      }

      io.emit("onlineUsers", Array.from(activeUsers.keys()));
    });

  });
}

module.exports = initializeSocket;