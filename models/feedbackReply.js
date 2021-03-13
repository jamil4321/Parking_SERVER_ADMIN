const mongoose = require("mongoose");

const feedbackReplySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    feedbackId: {
      type: String,
      trim: true,
      required: true,
    },
    user: {
      type: String,
      trim: true,
      required: true,
    },
    msg: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedbackreply", feedbackReplySchema);
