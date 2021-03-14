const mongoose = require("mongoose");
const ChatSchema = new mongoose.Schema(
  {
    ChatId: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
    },
    msg: {
      type: String,
    },
    isBooking: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("chat", ChatSchema);
