const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    user: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
    },
    msg: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("feedback", feedbackSchema);
