const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      default: ""
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
  
    },

    avatar: {
      type: String,
      default: ""
    },

    about: {
      type: String,
      default: "Hey there! I am using Gup-Sup"
    },

    lastSeen: {
      type: Date,
      default: Date.now
    },

    online: {
      type: Boolean,
      default: false
    },

    otp: String,
    otpExpire: Date,

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);