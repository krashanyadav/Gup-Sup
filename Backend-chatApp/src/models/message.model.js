const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "file", "audio", "video"],
      default: "text",
    },

    text: { type: String, default: "" },

    mediaUrl: String,
    fileName: String,
    fileSize: Number,

    // ✅ reply
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // ✅ edit
    edited: { type: Boolean, default: false },

    // ✅ delete   
    deletedFor: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
         },

    isDeleted: { type: Boolean,
        default: false

     },

    // ✅ reactions
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: String,
      },
    ],
    deliveredTo:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      status: {
          type: String,
          enum: ["sent", "delivered", "seen"],
          default: "sent",
        },
        
     
        readBy: [{ type: mongoose.Schema.Types.ObjectId, 
                    ref: "User" 
                }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);