const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const mongoose = require("mongoose");

// 1. sendMessage-controller
async function sendMessage(req, res) {
  try {
    const { receiverId, conversationId, text } = req.body;
    const senderId = req.user._id;


    let convo;

    // 1️⃣ existing conversation
    if (conversationId) {
      convo = await Conversation.findById(conversationId);
    }

    // 2️⃣ private conversation find/create
    if (!convo && receiverId) {
      convo = await Conversation.findOne({
        type: "private",
        participants: { $all: [senderId, receiverId] },
      });

      if (!convo) {
        convo = await Conversation.create({
          type: "private",
          participants: [senderId, receiverId],
        });
      }
    }

    if (!convo) {
      return res.status(400).json({
        message: "Conversation not found",
      });
    }

    // message send
    const { replyTo } = req.body;
    // 3️⃣ message prepare
    let messageData = {
      conversation: convo._id,
      sender: senderId,
      text: text || "",
      type: "text",
      deliveredTo: [req.user._id],
      status: "sent"
    };

    /// reply

    // media support
    if (req.file) {
      const mime = req.file.mimetype;

      console.log(mime)

      let type = "file";
      if (mime.startsWith("image")) type = "image";
      if (mime.startsWith("video")) type = "video";
      if (mime.startsWith("audio")) type = "audio";

      messageData.type = type;
      messageData.mediaUrl = req.file.path;
      messageData.fileName = req.file.originalname;
      messageData.fileSize = req.file.size;
    }

    // 4️⃣ save message
    const message = await Message.create(messageData);

// .......socket......
    //1. realtime message
    const io = req.app.get("io");
    io.to(convo._id.toString()).emit("newMessage", message);

    
    // 5️⃣ update conversation preview
    await Conversation.findByIdAndUpdate(convo._id, {
      lastMessage: text || "📎 Media",
      lastSender: senderId,
      lastMessageAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message,
    });

    
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Send message failed",
    });
  }
}

// 2. chat-controller
async function getMyChats(req, res) {
  try {
    const userId = req.user._id;

    const chats = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name avatar")
      .populate("lastSender", "name")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch chats",
    });
  }
}
//3. get message-controller


async function getMessages(req, res) {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // verify access
    const conversation = await Conversation.findOne({
      _id: new mongoose.Types.ObjectId(conversationId),
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found or access denied",
      });
    }

    const messages = await Message.find({
      conversation: conversation._id,
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
}

//4. mark-seen = controller
async function markSeen(req, res) {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    await Message.findByIdAndUpdate(messageId, {
      $addToSet: { readBy: userId },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      message: "Seen update failed",
    });
  }
}



//5. message delete 

// ================= DELETE MESSAGE =================

async function deleteMessage(req, res) {

  try {

    const { messageId, deleteType } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    // ================= ACCESS CHECK =================

    const conversation = await Conversation.findById(message.conversation);

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

// ================= DELETE FOR EVERYONE =================

if (deleteType === "everyone") {

  if (message.sender.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "Only sender can delete for everyone",
    });
  }

  await Message.findByIdAndDelete(messageId);

  const io = req.app.get("io");

  io.to(message.conversation.toString()).emit("messageDeleted", {
    messageId: messageId,
  });

}

    return res.json({
      success: true,
      message: "Message deleted",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Delete failed",
    });

  }

}

//6. edit message
async function editMessage(req, res) {
  try {
    const { messageId, text } = req.body;

    const msg = await Message.findById(messageId);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    // only sender edit
    if (msg.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    msg.text = text;
    msg.edited = true;
    await msg.save();

    //......edit real time
    const io = req.app.get("io");
  io.to(msg.conversation.toString()).emit("messageEdited", msg);

    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ message: "Edit failed" });
  }
}


//8.reaction controller
async function reactMessage(req, res) {
  try {
    const { messageId, emoji } = req.body;

    const msg = await Message.findById(messageId);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    const userId = req.user._id.toString();

    const existing = msg.reactions.find(
      (r) => r.user.toString() === userId
    );

    // ✅ अगर same reaction है → remove
    if (existing && existing.emoji === emoji) {
      msg.reactions = msg.reactions.filter(
        (r) => r.user.toString() !== userId
      );
    } 
    // ✅ अगर different reaction है → replace
    else {
      msg.reactions = msg.reactions.filter(
        (r) => r.user.toString() !== userId
      );

      msg.reactions.push({
        user: req.user._id,
        emoji,
      });
    }

    await msg.save();

    const io = req.app.get("io");

    io.to(msg.conversation.toString()).emit("reaction", {
      messageId,
      reactions: msg.reactions,
    });

    res.json({
      success: true,
      reactions: msg.reactions,
    });

  } catch (err) {
    res.status(500).json({ message: "Reaction failed" });
  }
}

// =====================================================
// 9️⃣ MARK DELIVERED
// POST /api/message/delivered/:messageId
// =====================================================
async function markDelivered(req, res) {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const msg = await Message.findById(messageId);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!msg.deliveredTo.includes(userId)) {
      msg.deliveredTo.push(userId);
      await msg.save();
    }

    const io = req.app.get("io");
    io.to(msg.conversation.toString()).emit("messageDelivered", {
      messageId,
      userId,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delivered update failed" });
  }
}

module.exports = {
  sendMessage,
  getMyChats,
  getMessages,
  markSeen,
  deleteMessage,
  editMessage,
  reactMessage,
  markDelivered,
}; 

// router.post("/send", authMiddleware, upload.single("file"), sendMessage);

// router.get("/get-chat", authMiddleware, getMyChats);

// router.get("/get-allMes/:conversationId", authMiddleware, getMessages);

// router.put("/seen/:messageId", authMiddleware, markSeen);

//............................................

//message delete api
// router.delete("/dlt-message", authMiddleware, deleteMessage);

// router.put("/message/edit", authMiddleware, );

// router.put("/message/delete", authMiddlewar );

// router.post("/message/forward", authMiddleware, );

// router.post("/message/react", authMiddleware, );

//router.post("/message/:messageId/delivered", auth, markDelivered);
