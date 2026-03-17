const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {

    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // group info
    groupName: {
      type: String,
      default: "",
    },

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    avatar: {
      type: String,
      default: "",
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastMessageAt: Date,

    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);